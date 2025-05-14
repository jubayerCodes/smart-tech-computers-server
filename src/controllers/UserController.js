const { ProfileAddService } = require("../services/ProfileServices");
const { SignUpService, LoginService } = require("../services/UserServices");

exports.SignUP = async (req, res) => {
  try {

    const result = await SignUpService(req.body);

    if (result.status === "success") {
      const { name, _id } = result?.result;

      const createdProfileResult = await ProfileAddService({
        name,
        _id,
      });

      if (createdProfileResult.status === "success") {
        return res.status(201).json(result);
      } else {
        return res.status(400).json(createdProfileResult);
      }
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    console.error("❌ Signup error:", error);
    return res.status(500).json({
      status: "fail",
      message: error.message || "Signup failed. Please try again later.",
    });
  }
};

exports.Login = async (req, res) => {
  try {
    const result = await LoginService(req);

    if (result.status !== "success") {
      return res.status(401).json(result); // Return 401 Unauthorized if login fails
    }

    // ✅ Issue JWT Token for successful login
    const token = result.token; // Assuming token is being generated in the LoginService

    // Set the token in cookies with proper secure settings
    const cookieOptions = {
      expires: new Date(Date.now() + 3600000), // 1 hour expiration
      httpOnly: true, // Ensures the cookie is only accessible via HTTP requests
      secure: process.env.NODE_ENV === "production", // Secure cookies in production (https)
      sameSite: "Strict", // Restrict cookie to same-origin requests
    };

    res.cookie("token", token, cookieOptions); // Set the token as a cookie

    return res.status(200).json({
      status: "success",
      message: "Login successful.",
      user: result.user,
      token: token, // Also send the token in response body (optional)
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    return res.status(500).json({
      status: "fail",
      message: "Login failed. Please try again later.",
    });
  }
};

exports.UserLogout = async (req, res) => {
  try {
    // Set cookie options to expire immediately
    const cookieOption = {
      expires: new Date(0), // Set the expiration date to the past to remove the cookie immediately
      httpOnly: true, // Ensures cookie is only accessible via HTTP requests
      secure: process.env.NODE_ENV === "production", // Ensure secure cookies in production (HTTPS)
      sameSite: "Strict", // Prevents sending cookies in cross-origin requests
    };

    // Clear the token cookie by setting it to an empty value with an expired date
    res.cookie("token", "", cookieOption);

    // Send success response
    return res.status(200).json({
      status: "success",
      message: "Successfully logged out",
    });
  } catch (error) {
    console.error("❌ Logout error:", error);
    return res.status(500).json({
      status: "fail",
      message: "Logout failed. Please try again later.",
    });
  }
};
