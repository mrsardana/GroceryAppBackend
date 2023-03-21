const multer = require("multer");
const Path = require("path");

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, "./uploads/categories")
//     },
//     filename: function (req, file, cb) {
//         cb(null, Date.now() + "-" + file.originalname)
//     }
// });
const storage = multer.memoryStorage();

const fileFilter = (req, file, callback) => {
    const acceptableExt = [".png", ".jpg", ".jpeg"];
    if (!acceptableExt.includes(Path.extname(file.originalname))) {
        return callback(new Error("Only .png, .jpg and .jpeg format allowed"));
    }

    const fileSize = parseInt(req.headers["content-length"]);

    if (fileSize > 1048576) {
        return callback(new Error("File Size Big"));
    }
    callback(null, true);

};

let upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    fileSize: 10485760,
});

module.exports = upload.single("categoryImage");
