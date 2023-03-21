const productServices = require("../services/product.service");
const upload = require("../middleware/product.upload");
const firebase = require('../config/firebase.config');

const { getStorage, ref, getDownloadURL, uploadBytesResumable } = require("firebase/storage");
const storage = getStorage();

global.XMLHttpRequest = require("xhr2");

exports.create = (req, res, next) => {
    upload(req, res, function (err) {
        if (err) {
            next(err);

        }
        else {
            // const path =req.file != undefined ? req.file.path.replace(/\\/g, "/") : "";

            const addImage = async (req, res) => {
                // Grab the file
                const file = req.file;
                // Format the filename
                const timestamp = Date.now();
                const name = file.originalname.split(".")[0];
                const type = file.originalname.split(".")[1];
                const fileName = `uploads/products/${name}-${timestamp}.${type}`;
                const imageRef = ref(storage, fileName);

                const metadata = {
                    contentType: req.file.mimetype,
                };
                const snapshot = await uploadBytesResumable(imageRef, req.file.buffer, metadata);

                const downloadURL = await getDownloadURL(snapshot.ref);

                var model = {
                    productName: req.body.productName,
                    category: req.body.category,
                    productShortDescription: req.body.productShortDescription,
                    productDescription: req.body.productDescription,
                    productPrice: req.body.productPrice,
                    productSalePrice: req.body.productSalePrice,
                    productSKU: req.body.productSKU,
                    productType: req.body.productType,
                    stockStatus: req.body.stockStatus,
                    productImage: downloadURL
                };
                productServices.createProduct(model, (error, result) => {
                    if (error) {
                        return next(error);
                    }

                    return res.status(200).send({
                        message: "Success",
                        data: result
                    });

                });

            }
            addImage(req, res);
            // var model = {
            //     productName: req.body.productName,
            //     category: req.body.category,
            //     productShortDescription: req.body.productShortDescription,
            //     productDescription: req.body.productDescription,
            //     productPrice: req.body.productPrice,
            //     productSalePrice: req.body.productSalePrice,
            //     productSKU: req.body.productSKU,
            //     productType: req.body.productType,
            //     stockStatus: req.body.stockStatus,
            //     productImage: path != "" ? "/" + path : ""
            // }
            // productServices.createProduct(model, (error, results) => {
            //     if (error) {
            //         return next(error);
            //     }
            //     else {
            //         return res.status(200).send({
            //             message: "Success",
            //             data: results
            //         });
            //     }
            // });
        }
    });
}

exports.findAll = (req, res, next) => {
    var model = {
        productName: req.query.productName,
        categoryId: req.query.categoryId,
        pageSize: req.query.pageSize,
        page: req.query.page,
        sort: req.query.sort,
    }

    productServices.getProducts(model, (error, results) => {
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


exports.findOne = (req, res, next) => {
    var model = {
        productId: req.params.id,
    }

    productServices.getProductById(model, (error, results) => {
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


exports.update = (req, res, next) => {
    upload(req, res, function (err) {
        if (err) {
            next(err);

        }
        else {
            // const path = req.file != undefined ? req.file.path.replace(/\\/g, "/") : "";
            const addImage = async (req, res) => {
                // Grab the file
                const file = req.file;
                // Format the filename
                const timestamp = Date.now();
                const name = file.originalname.split(".")[0];
                const type = file.originalname.split(".")[1];
                const fileName = `uploads/products/${name}-${timestamp}.${type}`;
                const imageRef = ref(storage, fileName);

                const metadata = {
                    contentType: req.file.mimetype,
                };
                const snapshot = await uploadBytesResumable(imageRef, req.file.buffer, metadata);

                const downloadURL = await getDownloadURL(snapshot.ref);

                var model = {
                    productId: req.params.id,
                    productName: req.body.productName,
                    category: req.body.category,
                    productShortDescription: req.body.productShortDescription,
                    productDescription: req.body.productDescription,
                    productPrice: req.body.productPrice,
                    productSalePrice: req.body.productSalePrice,
                    productSKU: req.body.productSKU,
                    productType: req.body.productType,
                    stockStatus: req.body.stockStatus,
                    productImage: downloadURL
                };
                productServices.updateProduct(model, (error, result) => {
                    if (error) {
                        return next(error);
                    }

                    return res.status(200).send({
                        message: "Success",
                        data: result
                    });

                });

            }
            addImage(req, res);
            // var model = {
            //     productId: req.params.id,
            //     productName: req.body.productName,
            //     category: req.body.category,
            //     productShortDescription: req.body.productShortDescription,
            //     productDescription: req.body.productDescription,
            //     productPrice: req.body.productPrice,
            //     productSalePrice: req.body.productSalePrice,
            //     productSKU: req.body.productSKU,
            //     productType: req.body.productType,
            //     stockStatus: req.body.stockStatus,
            //     productImage: path != "" ? "/" + path : ""
            // }
            // productServices.updateProduct(model, (error, results) => {
            //     if (error) {
            //         return next(error);
            //     }
            //     else {
            //         return res.status(200).send({
            //             message: "Success",
            //             data: results
            //         });
            //     }
            // });
        }
    });
}


exports.delete = (req, res, next) => {
    var model = {
        productId: req.params.id,
    }

    productServices.deleteProduct(model, (error, results) => {
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
