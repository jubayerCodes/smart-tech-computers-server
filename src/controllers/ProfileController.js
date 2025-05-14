const {
  ProfileAddService,
  ProfileDetailsService,
  ProfileUpdateService,
} = require("../services/ProfileServices");

// ====================== Profile All Controller ====================== //

exports.AddProfile = async (req, res) => {
  try {
    const result = await ProfileAddService(req); // Call the service to handle the logic
    return res.status(200).json(result); // Send the response to the client
  } catch (error) {
    console.error("Error in AddProfile controller:", error);
    return res
      .status(500)
      .json({ status: "fail", message: "Error adding profile." });
  }
};

exports.ProfileDetails = async (req, res) => {
  try {
    const result = await ProfileDetailsService(req?.params?.userID);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error in Profile Details controller:", error);
    return res
      .status(500)
      .json({ status: "fail", message: "Error getting profile details." });
  }
};

exports.UpdateProfile = async (req, res) => {
  try {
    const result = await ProfileUpdateService(req); // Call the service to handle the logic
    return res.status(200).json(result); // Send the response to the client
  } catch (error) {
    console.error("Error in UpdateProfile controller:", error);
    return res
      .status(500)
      .json({ status: "fail", message: "Error updating profile." });
  }
};
