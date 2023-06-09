const categoryController = require("../controllers/categories.controller");
const productController = require("../controllers/products.controller");
const UserController = require("../controllers/users.controller");
const sliderController = require("../controllers/slider.controller");
const relatedProductController = require("../controllers/related-product.controller");
const cartController = require("../controllers/cart.controller");
const favController = require("../controllers/fav.controller");
const orderController = require("../controllers/order.controller");
const { authenticationToken } = require('../middleware/auth')
const express = require("express");
const router = express.Router();

router.post("/category", categoryController.create);
router.get("/category", categoryController.findAll);
router.get("/category/:id", categoryController.findOne);
router.put("/category/:id", categoryController.update);
router.delete("/category/:id", categoryController.delete);


router.post("/product", productController.create);
router.get("/product", productController.findAll);
router.get("/product/:id", productController.findOne);
router.put("/product/:id", productController.update);
router.delete("/product/:id", productController.delete);


router.post("/slider", sliderController.create);
router.get("/slider", sliderController.findAll);
router.get("/slider/:id", sliderController.findOne);
router.put("/slider/:id", sliderController.update);
router.delete("/slider/:id", sliderController.delete);

router.post("/cart", [authenticationToken], cartController.create);
router.get("/cart", [authenticationToken], cartController.findAll);
router.delete("/cart", [authenticationToken], cartController.delete);

router.post("/fav", [authenticationToken], favController.create);
router.get("/fav", [authenticationToken], favController.findAll);
router.delete("/fav", [authenticationToken], favController.delete);

router.post("/order", [authenticationToken], orderController.create);
router.get("/order", [authenticationToken], orderController.findAll);
router.put("/order", [authenticationToken], orderController.update);

router.post("/register", UserController.register);
router.post("/login", UserController.login);

module.exports = router;
