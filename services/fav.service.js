const { fav } = require("../models/fav.model");
var async = require("async");

async function addFav(params, callback) {
    if (!params.userId) {
        return callback({
            message: "UserId Required"
        });
    }

    fav.findOne({ userId: params.userId }).then((favDB) => {
        if (favDB == null) {
            const favModel = new fav({
                userId: params.userId,
                products: params.products
            });

            favModel
                .save()
                .then((response) => {
                    return callback(null, response);
                })
                .catch((error) => {
                    return callback(error);
                });
        }
        else if (favDB.products.lenght == 0) {
            favDB.products = params.products;
            favDB.save();
            return callback(null, favDB);
        }
        else {
            async.eachSeries(params.products, function (product) {
                let itemIndex = favDB.products.findIndex(p => p.product == product.product);
                if (itemIndex === -1) {
                    favDB.products.push({
                        product: product.product
                    });
                    favDB.save();
                }
            });
            return callback(null, favDB);
        }

    })
}

async function getFav(params, callback) {
    fav.findOne({ userId: params.userId })
        .populate({
            path: "products",
            populate: {
                path: 'product',
                model: 'Product',
                select: 'productName productPrice productSalePrice productImage',
                // populate: {
                //     path: 'category',
                //     model: 'Category',
                //     select: 'categoryName'
                // }
            }
        })
        .then((response) => {
            return callback(null, response);
        })
        .catch((error) => {
            return callback(error);
        });
}

async function removeFavItem(params, callback) {
    fav.findOne({ userId: params.userId }).then((favDB) => {
        if (params.productId) {
            const productId = params.productId;

            if (favDB.products.lenght === 0) {
                return callback(null, "Fav empty!");
            }
            else {
                let itemIndex = favDB.products.findIndex(p => p.product == productId);

                if (itemIndex === -1) {
                    return callback(null, "Invalid Product")
                }
                else {
                    favDB.products.splice(itemIndex, 1);
                    favDB
                        .save()
                        .then(
                            callback(null, "Fav Updated")
                        )
                        .catch((error) => {
                            return callback(error);
                        });
                }
            }
        }

    });
}

module.exports = {
    addFav,
    getFav,
    removeFavItem
}