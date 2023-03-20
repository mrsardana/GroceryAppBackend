const { relatedProduct } = require("../models/related-products.model");
const { product } = require('../models/product.model');
const { model } = require("mongoose");

async function addRelatedProduct(params, callback) {
    if (!params.product) {
        return callback(
            {
                message: "Product Id required",
            },
        );
    }

    if (!params.relatedProduct) {
        return callback(
            {
                message: "Related Product Id required",
            },

        );
    }

    const relatedProductModel = new relatedProduct(params);
    relatedProductModel
        .save()
        .then(async (response) => {
            await product.findOneAndUpdate(
                {
                    _id: params.product
                },
                {
                    $addToSet: {
                        "relatedProduct": relatedProductModel
                    }
                }
            );
            return callback(null, response);
        })
        .catch((error) => {
            return callback(error);
        });
}

async function removeRelatedProduct(params, callback) {
    const id = params.id;

    relatedProduct.findByIdAndRemove(id)
        .then((response) => {
            if (!response) {
                callback("Product Id not found")
            }
            else {
                callback(null, response);
            }
        })
        .catch((error) => {
            return callback(error);
        })

}

module.exports = {
    addRelatedProduct,
    removeRelatedProduct
}