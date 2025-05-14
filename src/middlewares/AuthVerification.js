const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET; // Get secret from .env

module.exports = (req, res, next) => {
  try {
    // Retrieve token from headers, cookies, or query params
    let token =
        req.headers["authorization"]?.split(" ")[1] || // Bearer Token
        req.cookies["token"] || // Cookie Token
        req.query.token; // Query Token (optional)

    // If no token is found, return a 401 Unauthorized response
    if (!token) {
      console.error("❌ No token provided in the request.");
      return res.status(401).json({
        status: "fail",
        message: "No token provided, unauthorized.",
      });
    }

    // Decode and verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      console.error("❌ Token is invalid.");
      return res.status(401).json({
        status: "fail",
        message: "Unauthorized, invalid token.",
      });
    }

    // Attach decoded user info to req.user
    req.user = {
      email: decoded.email,
      userId: decoded.userId,
    };

    // Check if it'uploads the /dashboard route and ensure the user is authenticated
    if (req.originalUrl === '/dashboard' && !req.user) {
      return res.status(401).json({
        status: "fail",
        message: "User is not authenticated, cannot access the dashboard.",
      });
    }

    // Proceed to next middleware or route
    next();
  } catch (error) {
    console.error("❌ Token Verification Error:", error.message);

    // Handle token expiration error
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        status: "fail",
        message: "Token has expired. Please log in again.",
      });
    }

    // Handle other errors (e.g., incorrect token, malformed token)
    console.error(error.stack); // For debugging
    return res.status(500).json({
      status: "fail",
      message: "Token verification failed. Please try again.",
    });
  }
};
