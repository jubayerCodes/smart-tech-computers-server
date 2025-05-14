const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/ProductController");
const UserController = require("../controllers/UserController");
const SliderController = require("../controllers/SliderController");
const ProfileController = require("../controllers/ProfileController");
const OrderController = require("../controllers/OrderController");
const UserModel = require("../models/UserModel");
const StockController = require("../controllers/StockController")

const AuthVerification = require("../middlewares/AuthVerification");
const { FeaturesList } = require("../controllers/FeaturesController");
const { upload } = require("../services/ProductServices");
const path = require("path");
const mongoose = require("mongoose");
const ObjectID = mongoose.Types.ObjectId;

// Protected Routes
router.get("/dashboard", AuthVerification, async (req, res) => {
  const email = req?.user?.email;

  const userInfo = await UserModel.findOne({ email });

  const role = userInfo?.role;

  if (role === "admin") {
    return res.status(200).json({
      status: "success",
      message: "Welcome to the dashboard",
    });
  } else {
    return res.status(200).json({
      status: "failed",
      message: "Failed to access dashboard",
    });
  }
});

// User API
router.post("/SignUP", UserController.SignUP);
router.post("/Login", UserController.Login);
router.post("/Logout", UserController.UserLogout);

// Profile API
router.post("/profile", ProfileController.AddProfile);
router.get("/profile-details/:userID", ProfileController.ProfileDetails);
router.put("/profile/:userID", upload.single("profileImg"), ProfileController.UpdateProfile);

// Brand CRUD APIs
router.post("/brands", upload.single("brandImg"), ProductController.AddBrands);
router.get("/brands", ProductController.ProductBrandList);
router.put("/brands/:id", upload.single("brandImg"), ProductController.ProductBrandUpdate);
router.delete("/brands/:id", ProductController.ProductBrandDelete);

// Category CRUD APIs
router.post("/category", upload.single("categoryImg"), ProductController.AddCategory);
router.get("/category", ProductController.CategoryList);
router.put("/category/:id", upload.single("categoryImg"), ProductController.CategoryUpdate);
router.delete("/category/:id", ProductController.CategoryDelete);

// Sub Category CRUD APIs
router.post("/sub-category", ProductController.AddSubCategory);
router.get("/sub-category", ProductController.SubCategoryList);
router.put("/sub-category/:id", ProductController.SubCategoryUpdate);
router.delete("/sub-category/:id", ProductController.SubCategoryDelete);

// Product Add CRUD APIs
router.post("/add-product", upload.array("productImgs", 8), ProductController.AddProduct);
router.get("/product-list", ProductController.ProductList);
router.get("/product-details/:id", ProductController.ProductDetails);
router.put("/update-product/:id", upload.array("productImgs", 8), ProductController.ProductUpdate);
router.delete("/remove-product/:id", ProductController.ProductDelete);

// Hero Slider CRUD APIs
router.post("/hero-slider", upload.single("slideImg"), SliderController.AddHeroSlider);
router.get("/hero-slider", SliderController.HeroSliderList);
router.put("/hero-slider/:id", upload.single("slideImg"), SliderController.HeroSliderUpdate);
router.delete("/hero-slider/:id", SliderController.HeroSliderDelete);

// Order Invoice APIs
router.post("/create-invoice", OrderController.PlaceOrder);
router.get("/order-list", OrderController.OrderList)
router.get("/order-details/:id", OrderController.OrderDetails)
router.patch("/order-update/:id", OrderController.OrderStatusUpdate)
router.delete("/order-delete/:id", OrderController.OrderDelete)

// Stock APIs
router.post("/create-stock", StockController.AddStock)


module.exports = router;