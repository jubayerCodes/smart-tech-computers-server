const {
  HeroSliderAddService,
  HeroSliderListService,
  HeroSliderUpdateService,
  HeroSliderDeleteService,
} = require("../services/SliderServices");

// ====================== Hero Slider All Controller ====================== //

exports.AddHeroSlider = async (req, res) => {
  try {
    const result = await HeroSliderAddService(req); // Call the service to handle the logic
    return res.status(200).json(result); // Send the response to the client
  } catch (error) {
    console.error("Error in AddHeroSlider controller:", error);
    return res
      .status(500)
      .json({ status: "fail", message: "Error adding hero slider." });
  }
};

exports.HeroSliderList = async (req, res) => {
  try {
    let result = await HeroSliderListService();
    return res.status(200).json(result); // Ensure JSON response
  } catch (e) {
    return res.status(500).json({ status: "Fail", data: e.toString() }); // Ensure JSON error response
  }
};

exports.HeroSliderUpdate = async (req, res) => {
  try {
    const result = await HeroSliderUpdateService(req);

    // Check if the update was successful and return the updated category data
    if (result.status === "success") {
      return res.status(200).json(result.data); // Ensure updated category data is sent back
    } else {
      return res.status(400).json({ status: "fail", message: result.message });
    }
  } catch (e) {
    console.error("Error:", e);
    return res.status(500).json({ status: "Fail", message: e.toString() });
  }
};

exports.HeroSliderDelete = async (req, res) => {
  try {
    const slideId = req.params.id; // Ensure this matches the route parameter
    const result = await HeroSliderDeleteService(slideId);
    return res.status(200).json(result);
  } catch (e) {
    return res.status(500).json({ status: "fail", message: e.toString() });
  }
};
