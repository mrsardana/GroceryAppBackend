const categoriesService = require("../services/categories.service");
const upload = require("../middleware/category.upload");
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
            // const path = req.file != undefined ? req.file.path.replace(/\\/g, "/") : "";
            const addImage = async (req, res) => {
                // Grab the file
                const file = req.file;
                // Format the filename
                const timestamp = Date.now();
                const name = file.originalname.split(".")[0];
                const type = file.originalname.split(".")[1];
                const fileName = `uploads/categories/${name}-${timestamp}.${type}`;
                const imageRef = ref(storage, fileName);

                const metadata = {
                    contentType: req.file.mimetype,
                };
                const snapshot = await uploadBytesResumable(imageRef, req.file.buffer, metadata);

                const downloadURL = await getDownloadURL(snapshot.ref);

                var model = {
                    categoryName: req.body.categoryName,
                    categoryDescription: req.body.categoryDescription,
                    categoryImage: downloadURL
                };
                categoriesService.createCategory(model, (error, result) => {
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
            //     categoryName: req.body.categoryName,
            //     categoryDescription: req.body.categoryDescription,
            //     categoryImage: path != "" ? "/" + path : "",
            // };
            // categoriesService.createCategory(model, (error, results) => {
            //     if (error) {
            //         return next(error);
            //     }
            //     else {
            //         return res.status(200).send({
            //             message: "Success",
            //             data: results,
            //         });
            //     }
            // });
        }
    });
};



exports.findAll = (req, res, next) => {

    var model = {
        categoryName: req.query.categoryName,
        pageSize: req.query.pageSize,
        page: req.query.page,
    };
    categoriesService.getCategories(model, (error, results) => {
        if (error) {
            return next(error);
        }
        else {
            return res.status(200).send({
                message: "Success",
                data: results,
            });
        }
    });
}


exports.findOne = (req, res, next) => {

    var model = {
        categoryId: req.params.id,
    };
    categoriesService.getCategoryById(model, (error, results) => {
        if (error) {
            return next(error);
        }
        else {
            return res.status(200).send({
                message: "Success",
                data: results,
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
                const fileName = `uploads/categories/${name}-${timestamp}.${type}`;
                const imageRef = ref(storage, fileName);

                const metadata = {
                    contentType: req.file.mimetype,
                };
                const snapshot = await uploadBytesResumable(imageRef, req.file.buffer, metadata);

                const downloadURL = await getDownloadURL(snapshot.ref);

                var model = {
                    categoryId: req.params.id,
                    categoryName: req.body.categoryName,
                    categoryDescription: req.body.categoryDescription,
                    categoryImage: downloadURL
                };
                categoriesService.updateCategory(model, (error, result) => {
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
            //     categoryId: req.params.id,
            //     categoryName: req.body.categoryName,
            //     categoryDescription: req.body.categoryDescription,
            //     categoryImage: path != "" ? "/" + path : "",
            // };
            // categoriesService.updateCategory(model, (error, results) => {
            //     if (error) {
            //         return next(error);
            //     }
            //     else {
            //         return res.status(200).send({
            //             message: "Success",
            //             data: results,
            //         });
            //     }
            // });
        }
    });
};


exports.delete = (req, res, next) => {

    var model = {
        categoryId: req.params.id,
    };
    categoriesService.deleteCategory(model, (error, results) => {
        if (error) {
            return next(error);
        }
        else {
            return res.status(200).send({
                message: "Success",
                data: results,
            });
        }
    });
}