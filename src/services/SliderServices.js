const HeroSliderModel = require("../models/HeroSliderModel");
const mongoose = require("mongoose");
const ObjectID = mongoose.Types.ObjectId;

const multer = require("multer");
const path = require("path");

const fs = require("fs");

// Ensure the upload directory exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Directory to store uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Generate a unique file name
  },
});

// Create upload instance with limits and storage configuration
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 }, // Max file size of 1MB
});

// ========================== Hero Slider All Functionality ========================== //
// Hero Slider CRUD Services

const HeroSliderAddService = async (req) => {
  try {
    const { title, des, status } = req.body;
    const slideImg = req.file ? `/uploads/${req.file.filename}` : null;

    if (!slideImg || !status || !title) {
      return {
        status: "fail",
        message: "Slider title and status are required.",
      };
    }

    const existingHeroSlider = await HeroSliderModel.findOne({ title });
    if (existingHeroSlider) {
      return { status: "fail", message: "Slide already exists" };
    }

    // Include heroSliderImg in the model
    const newHeroSlider = new HeroSliderModel({
      title,
      des,
      status,
      slideImg,
    });
    await newHeroSlider.save();

    return {
      status: "success",
      message: "Hero Slider added successfully",
      data: newHeroSlider,
    };
  } catch (error) {
    console.error("Error in HeroSliderAddService:", error.message);
    return {
      status: "fail",
      message: "Error adding hero slider. Please try again.",
    };
  }
};

const HeroSliderListService = async () => {
  try {
    let data = await HeroSliderModel.find(); // Ensure subcategories are populated
    return { status: "success", data: data }; // Ensure JSON response
  } catch (e) {
    return { status: "Fail", data: e.toString() }; // Ensure JSON error response
  }
};

const HeroSliderUpdateService = async (req) => {
  try {
    const { title, des, status } = req.body;
    const slideImg = req.file ? `/uploads/${req.file.filename}` : null;

    // Check if the Hero Slider exists
    const existingHeroSlider = await HeroSliderModel.findById(req.params.id);
    if (!existingHeroSlider) {
      return { status: "fail", message: "Hero Slider not found" };
    }

    // Update the Hero Slider fields
    existingHeroSlider.title = title || existingHeroSlider.title;
    existingHeroSlider.des = des || existingHeroSlider.des;
    existingHeroSlider.status = status || existingHeroSlider.status;
    if (slideImg) existingHeroSlider.slideImg = slideImg; // Update image if new one is uploaded

    // Save updated Hero Slider
    await existingHeroSlider.save();

    return {
      status: "success",
      message: "Hero Slider updated successfully",
      data: existingHeroSlider,
    };
  } catch (error) {
    console.error("Error in HeroSliderUpdateService:", error.message);
    return {
      status: "fail",
      message: "Error updating hero slide. Please try again.",
    };
  }
};

const HeroSliderDeleteService = async (slideId) => {
  try {
    const slide = await HeroSliderModel.findById(slideId);
    if (!slide) {
      return { status: "fail", message: "Slide not found" };
    }

    await HeroSliderModel.findByIdAndDelete(slideId);
    return { status: "success", message: "Slide deleted successfully" };
  } catch (error) {
    console.error("Error in HeroSliderDeleteService:", error.message);
    return {
      status: "fail",
      message: "Error deleting Slide. Please try again.",
    };
  }
};

module.exports = {
  upload,
  HeroSliderAddService,
  HeroSliderListService,
  HeroSliderUpdateService,
  HeroSliderDeleteService,
};
