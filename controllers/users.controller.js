const userServices = require("../services/users.service");
const cartService = require('../services/cart.service');

exports.register = (req, res, next) => {
    userServices.register(req.body, (error, results) => {
        if (error) {
            return next(error);
        }
        else {
            var model = {
                userId: results._id.toString(),
                products: []
            };

            cartService.addCart(model, (error, results) => {
            });
            return res.status(200).send({
                message: "Success",
                data: results

            });
        }

    });
};

exports.login = (req, res, next) => {
    const { email, password } = req.body;

    userServices.login({ email, password }, (error, results) => {
        if (error) {
            return next(error);
        }
        return res.status(200).send({
            message: "Success",
            data: results
        });
    });
};