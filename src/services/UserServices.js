const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const EmailSend = require("../utility/EmailHelper");
const UserModel = require("../models/UserModel");
const { EncodeToken } = require("../utility/TokenHelper");

// Signup Service
const SignUpService = async (data) => {
  try {
    let { name, email, mobile, password, img_url, status, role } = data;

    // ✅ Validate required fields
    if (!name || !email || !mobile || !password) {
      return { status: "fail", message: "All fields are required." };
    }

    email = email.toLowerCase(); // Ensure email is stored in lowercase

    // ✅ Email format validation
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(email)) {
      return { status: "fail", message: "Invalid email format." };
    }

    // ✅ Password strength validation
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      return {
        status: "fail",
        message:
          "Password must be at least 8 characters long, contain at least one number and one uppercase letter.",
      };
    }

    // ✅ Check for existing email
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return { status: "fail", message: "Email already exists." };
    }

    // ✅ Check for existing mobile number
    const existingMobile = await UserModel.findOne({ mobile });
    if (existingMobile) {
      return { status: "fail", message: "Mobile number already exists." };
    }

    // ✅ Set default values for optional fields
    img_url = img_url || "default_image_url";
    status = status || "active";
    role = role || "user";

    // ✅ Hash the password securely
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // ✅ Create new user
    const newUser = new UserModel({
      name,
      email,
      mobile,
      password: hashedPassword,
      img_url,
      status,
      role,
    });

    // ✅ Save user to the database
    const result = await newUser.save();

    // ✅ Generate a token
    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET || "your_secret_key", // Replace with environment variable
      { expiresIn: "1h" } // Token expires in 1 hour
    );

    // Return success response
    return {
      status: "success",
      message: "User registered successfully.",
      token,
      result,
    };
  } catch (error) {
    console.error("❌ Error in SignUpService:", error.message);
    return { status: "fail", message: "Something went wrong during signup." };
  }
};

const LoginService = async (req) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return { status: "fail", message: "Email and password are required." };
    }

    // Convert email to lowercase for consistency
    email = email.toLowerCase();

    // 🔹 Step 1: Check if user exists
    const user = await UserModel.findOne({ email });
    if (!user) {
      return { status: "fail", message: "Invalid email or password." };
    }

    // 🔹 Step 2: Compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return { status: "fail", message: "Invalid email or password." };
    }

    // 🔹 Step 3: Generate a JWT token
    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email, role: user.role },
      process.env.JWT_SECRET || "your_secret_key",
      { expiresIn: "1h" }
    );

    // 🔹 Step 4: Return success response
    return {
      status: "success",
      message: "Login successful.",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
      },
      token,
    };
  } catch (error) {
    console.error("❌ Login Error:", error);
    return { status: "fail", message: "Something went wrong during login." };
  }
};

module.exports = {
  SignUpService,
  LoginService,
};
