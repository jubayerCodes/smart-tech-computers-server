const ProfileModel = require("../models/ProfileModel");
const mongoose = require("mongoose");
const ObjectID = new mongoose.Types.ObjectId();

const multer = require("multer");
const path = require("path");

const fs = require("fs");
const UserModel = require("../models/UserModel");

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

// ========================== Profile All Functionality ========================== //
// Profile CRUD Services
const ProfileAddService = async (data) => {
  try {
    const { name: cus_name, _id: userID } = data;

    const existingProfile = await ProfileModel.findOne({ userID });
    if (existingProfile) {
      return { status: "fail", message: "Profile already exists" };
    }

    // Include heroSliderImg in the model
    const newProfile = new ProfileModel({ cus_name, userID });
    await newProfile.save();

    return {
      status: "success",
      message: "Profile added successfully",
      data: newProfile,
    };
  } catch (error) {
    console.error("Error in ProfileAddService:", error.message);
    return {
      status: "fail",
      message: "Error adding profile. Please try again.",
    };
  }
};

const ProfileDetailsService = async (userID) => {
  const result = await ProfileModel.findOne({ userID }).populate(
    "userID",
    "email mobile img_url"
  );

  return {
    status: "success",
    data: result,
  };
};

const ProfileUpdateService = async (req) => {
  const {
    cus_name,
    cus_country,
    cus_state,
    cus_city,
    cus_postcode,
    cus_address,
  } = req.body;

  const profileImg = req.file ? `/uploads/${req.file.filename}` : null;

  const existingProfile = await ProfileModel.findOne({
    userID: req.params.userID,
  });

  const existingUser = await UserModel.findById(req.params.userID);

  if (!existingProfile || !existingUser) {
    return { status: "fail", message: "Profile not found" };
  }

  existingProfile.cus_name = cus_name || existingProfile.cus_name;
  existingProfile.cus_country = cus_country || existingProfile.cus_country;
  existingProfile.cus_state = cus_state || existingProfile.cus_state;
  existingProfile.cus_city = cus_city || existingProfile.cus_city;
  existingProfile.cus_postcode = cus_postcode || existingProfile.cus_postcode;
  existingProfile.cus_address = cus_address || existingProfile.cus_address;

  if (profileImg) existingUser.img_url = profileImg;
  existingUser.name = cus_name || existingUser.name;

  await existingProfile.save();
  await existingUser.save();

  const email = existingUser?.email;
  const mobile = existingUser?.mobile;
  const img_url = existingUser?.img_url;

  const updatedProfile = {
    ...existingProfile._doc,
    userID: { email, mobile, img_url },
  };

  return {
    status: "success",
    message: "Profile updated successfully",
    data: updatedProfile,
  };
};

module.exports = {
  ProfileAddService,
  ProfileDetailsService,
  ProfileUpdateService,
};
