const relatedProductServices = require("../services/related-products.service");

exports.create = (req, res, next) => {
    relatedProductServices.addRelatedProduct(req.body, (err, results) => {
        if (err) {
            next(err);

        }
        return res.status(200).send({
            message: "Success",
            data: results
        });
    })
}

exports.delete = (req, res, next) => {
    var model = {
        id: req.params.id,
    }

    relatedProductServices.removeRelatedProduct(model, (error, results) => {
        if (error) {
            return next(error);
        }
        else {
            return res.status(200).send({
                message: "Success",
                data: results
            });
        }
    });
}
