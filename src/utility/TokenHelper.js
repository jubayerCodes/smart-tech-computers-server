const jwt = require("jsonwebtoken");

// Load secret from environment variables
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error("❌ ERROR: JWT_SECRET is missing from .env!");
  process.exit(1); // Stop server if secret is missing
}

// ✅ Sign Token
exports.EncodeToken = (email, userId) => {
  return jwt.sign({ email, userId }, JWT_SECRET, { expiresIn: "24h" });
};

// ✅ Verify Token
exports.DecodeToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    console.error("❌ Token decode error:", error.message);
    return { status: "fail", message: "Token verification failed" };
  }
};



// const jwt = require("jsonwebtoken");
//
// const KEY = process.env.JWT_SECRET || "123-ABC-XYZ";  // Using environment variable
//
// // Encode Token
// exports.EncodeToken = (email, user_id) => {
//   let EXPIRE = { expiresIn: "24h" };
//   let PAYLOAD = { email: email, user_id: user_id };
//   return jwt.sign(PAYLOAD, KEY, EXPIRE);
// };
//
// // Decode Token
// exports.DecodeToken = (token) => {
//   try {
//     return jwt.verify(token, KEY);  // Verify and decode the token
//   } catch (e) {
//     console.error("❌ Token decode error:", e.message);  // Log the error
//     return { status: "fail", message: "Token verification failed" };  // Return detailed error
//   }
// };
