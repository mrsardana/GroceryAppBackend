const favService = require('../services/fav.service');

exports.create = (req, res, next) => {
    var model = {
        userId: req.user.userId,
        products: req.body.products
    };

    favService.addFav(model, (error, results) => {
        if (error) {
            return next(error);
        }
        return res.status(200).send({
            message: "Success",
            data: results,
        });
    });
}

exports.findAll = (req, res, next) => {

    favService.getFav({ userId: req.user.userId }, (error, results) => {
        if (error) {
            return next(error);
        }
        return res.status(200).send({
            message: "Success",
            data: results,
        });
    });
}

exports.delete = (req, res, next) => {
    var model = {
        userId: req.user.userId,
        productId: req.body.productId
    };

    favService.removeFavItem(model, (error, results) => {
        if (error) {
            return next(error);
        }
        return res.status(200).send({
            message: "Success",
            data: results,
        });
    });
}