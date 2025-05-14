const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const DataSchema = new mongoose.Schema(
    {
        img_url: { type: String, default: "default_image_url" },
        name: { type: String, required: true },
        email: { type: String, unique: true, lowercase: true, required: true },
        mobile: { type: String, unique: true, required: true },
        password: { type: String, required: true },
        status: { type: String, default: "active" },
        role: { type: String, default: "user" },
        otp: { type: String },
    },
    { timestamps: true, versionKey: false }
);

// 🔹 Ensure password is hashed before saving
DataSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    // Check if the password is already hashed
    if (this.password.startsWith("$2b$") || this.password.startsWith("$2a$")) {
        return next();
    }

    try {
        this.password = await bcrypt.hash(this.password, 10);
        next();
    } catch (err) {
        console.error("❌ Error hashing password:", err.message);
        next(err);
    }
});

// 🔹 Handle duplicate field errors properly
DataSchema.post("save", function (error, doc, next) {
    if (error.name === "MongoServerError" && error.code === 11000) {
        if (error.keyPattern.email) {
            return next(new Error("Email already exists"));
        } else if (error.keyPattern.mobile) {
            return next(new Error("Mobile number already exists"));
        } else {
            return next(new Error("Duplicate field error"));
        }
    }
    next(error);
});

const UserModel = mongoose.model("users", DataSchema);
module.exports = UserModel;
