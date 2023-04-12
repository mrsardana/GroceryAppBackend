const { user } = require('../models/user.model');
const { cards } = require('../models/cards.model');
const { order } = require("../models/order.model");

const stripeService = require("../services/stripe.service");
const cartService = require("../services/cart.service");

async function createOrder(params, callback) {
    user.findOne({ _id: params.userId }).then(async (userDB) => {
        var model = {};
        if (!userDB.stripeCustomerID) {
            await stripeService.createCustomer(
                {
                    "name": userDB.fullName,
                    "email": userDB.email
                },
                (error, results) => {
                    if (error) {
                        return callback(error);
                    }
                    if (results) {
                        userDB.stripeCustomerID = results.id;
                        userDB.save();

                        model.stripeCustomerID = results.id;
                    }
                }
            )
        }
        else {
            model.stripeCustomerID = userDB.stripeCustomerID;
        }

        cards.findOne({
            customerId: model.stripeCustomerID,
            cardNumber: params.card_Number,
            cardExpMonth: params.card_ExpMonth,
            cardExpYear: params.card_ExpYear
        }).then(async (cardDB) => {
            if (!cardDB) {
                await stripeService.addCard({
                    "card_Name": params.card_Name,
                    "card_Number": params.card_Number,
                    "card_ExpMonth": params.card_ExpMonth,
                    "card_ExpYear": params.card_ExpYear,
                    "card_CVC": params.card_CVC,
                    "customer_Id": model.stripeCustomerID
                }, (error, results) => {
                    if (error) {
                        return callback(error);
                    }
                    if (results) {
                        const cardModel = new cards({
                            cardId: results.card,
                            cardName: params.card_Name,
                            cardNumber: params.card_Number,
                            cardExpMonth: params.card_ExpMonth,
                            cardExpYear: params.card_ExpYear,
                            cardCVC: params.card_CVC,
                            customerId: model.stripeCustomerID
                        });
                        cardModel.save();
                        model.cardId = results.card;
                    }
                });
            }
            else {
                model.cardId = cardDB.cardId;
            }

            await stripeService.generatePaymentIntent({
                "receipt_email": userDB.email,
                "amount": params.amount,
                "card_id": model.cardId,
                "customer_id": model.stripeCustomerID
            }, (error, results) => {
                if (error) {
                    return callback(error);
                }
                if (results) {
                    model.paymentIntentId = results.id;
                    model.client_secret = results.client_secret;
                }

            });
            cartService.getCart({ userId: userDB.id }, function (err, cartDB) {
                if (err) {
                    return callback(err);
                }
                else {
                    if (cartDB) {
                        var products = [];
                        var grandTotal = 0;

                        cartDB.products.forEach(product => {
                            products.push({
                                product: product.product._id,
                                qty: product.qty,
                                amount: product.product.productSalePrice * product.qty
                            });
                            grandTotal += product.product.productSalePrice * product.qty;
                        });
                        const ordelModel = new order({
                            userId: cartDB.userId,
                            products: products,
                            orderStatus: "pending",
                            grandTotal: grandTotal
                        });
                        ordelModel
                            .save()
                            .then((response) => {
                                model.orderId = response._id;
                                return callback(null, model);
                            })
                            .catch((error) => {
                                return callback(error);
                            })
                    }
                }
            });

        })


    })
}

async function updateOrder(params, callback) {
    var model = {
        orderStatus: params.status,
        transactionId: params.transaction_id
    };
    order.findByIdAndUpdate(params.orderId, model, { useFindAndModify: false })
        .then((response) => {
            if (!response) {
                callback('Order Update Failed');
            }
            else {
                if (params.status == "success") {
                    // CLEAR CART
                    var userId = response.userId;
                    var qty = "empty_cart"
                    var model = {
                        userId: userId,
                        qty: qty
                    };
                    cartService.removeCartItem(model, (error, results) => {
                    });

                }

                return callback(null, response);
            }
        })
        .catch((error) => {
            return callback(error);
        });
}

async function getOrders(params, callback) {
    order.find({ userId: params.userId })
        .populate({
            path: "products",
            populate: {
                path: 'product',
                model: "Product",
                select: 'productName productPrice productSalePrice productImage',
                // populate: {
                //     path: 'category',
                //     model: 'Category',
                //     select: 'CategoryName'
                // }
            }

        })
        .then((response) => {
            return callback(null, response)
        })
        .catch((error) => {
            return callback(error);
        })
}

module.exports = {
    createOrder,
    updateOrder,
    getOrders
}