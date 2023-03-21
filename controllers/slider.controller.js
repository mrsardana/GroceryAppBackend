const sliderService = require('../services/slider.service');
const upload = require('../middleware/slider.upload');
const firebase = require('../config/firebase.config');

const { getStorage, ref, getDownloadURL, uploadBytesResumable, } = require("firebase/storage");
const storage = getStorage();

global.XMLHttpRequest = require("xhr2");

exports.create = (req, res, next) => {
    upload(req, res, function (err) {
        if (err) {
            next(err);
        }

        else {

            const addImage = async (req, res) => {
                // Grab the file
                const file = req.file;
                // Format the filename
                const timestamp = Date.now();
                const name = file.originalname.split(".")[0];
                const type = file.originalname.split(".")[1];
                const fileName = `uploads/sliders/${name}-${timestamp}.${type}`;
                const imageRef = ref(storage, fileName);

                const metadata = {
                    contentType: req.file.mimetype,
                };
                const snapshot = await uploadBytesResumable(imageRef, req.file.buffer, metadata);

                const downloadURL = await getDownloadURL(snapshot.ref);

                var model = {
                    sliderName: req.body.sliderName,
                    sliderDescription: req.body.sliderDescription,
                    sliderImage: downloadURL
                };
                sliderService.createSlider(model, (error, result) => {
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
        }
    })
};

exports.findAll = (req, res, next) => {
    var model = {
        sliderName: req.query.sliderName,
        pageSize: req.query.pageSize,
        page: req.query.page
    }

    sliderService.getSliders(model, (error, result) => {
        if (error) {
            return next(error);
        }

        return res.status(200).send({
            message: "Success",
            data: result
        });

    });
}

exports.findOne = (req, res, next) => {
    var model = {
        sliderId: req.params.id,
    }

    sliderService.getSliderByID(model, (error, result) => {
        if (error) {
            return next(error);
        }

        return res.status(200).send({
            message: "Success",
            data: result
        });

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
                const fileName = `${name}_${timestamp}.${type}`;
                const imageRef = ref(storage, fileName);

                const metadata = {
                    contentType: req.file.mimetype,
                };
                const snapshot = await uploadBytesResumable(imageRef, req.file.buffer, metadata);

                const downloadURL = await getDownloadURL(snapshot.ref);

                var model = {
                    sliderId: req.params.id,
                    sliderName: req.body.sliderName,
                    sliderDescription: req.body.sliderDescription,
                    sliderImage: downloadURL
                };
                sliderService.updateSlider(model, (error, result) => {
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
        }
    })
};


exports.delete = (req, res, next) => {
    var model = {
        sliderId: req.params.id,
    }

    sliderService.deleteSlider(model, (error, result) => {
        if (error) {
            return next(error);
        }

        return res.status(200).send({
            message: "Success",
            data: result
        });

    });
}