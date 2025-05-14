const {
  BrandAddService,
  BrandListService,
  BrandDeleteService,
  BrandUpdateService,
  CategoryAddService,
  CategoryListService,
  CategoryUpdateService,
  CategoryDeleteService,
  SubCategoryAddService,
  SubCategoryListService,
  SubCategoryDeleteService,
  SubCategoryUpdateService,
  ProductAddService,
  ProductListService,
  ProductUpdateService,
  ProductDeleteService,
  ProductDetailsService,
} = require("../services/ProductServices");

// ====================== Brands All Controller ====================== //
exports.AddBrands = async (req, res) => {
  try {
    const result = await BrandAddService(req); // Call the service to handle the logic
    return res.status(200).json(result); // Send the response to the client
  } catch (error) {
    console.error("Error in AddBrands controller:", error);
    return res
      .status(500)
      .json({ status: "fail", message: "Error adding brand." });
  }
};

exports.ProductBrandList = async (req, res) => {
  try {
    let result = await BrandListService();
    return res.status(200).json(result); // Ensure JSON response
  } catch (e) {
    return res.status(500).json({ status: "Fail", data: e.toString() }); // Ensure JSON error response
  }
};

exports.ProductBrandUpdate = async (req, res) => {
  try {
    const result = await BrandUpdateService(req);

    // Check if the update was successful and return the updated brand data
    if (result.status === "success") {
      return res.status(200).json(result.data); // Ensure updated brand data is sent back
    } else {
      return res.status(400).json({ status: "fail", message: result.message });
    }
  } catch (e) {
    console.error("Error:", e);
    return res.status(500).json({ status: "Fail", message: e.toString() });
  }
};

exports.ProductBrandDelete = async (req, res) => {
  try {
    const brandId = req.params.id; // Get the brand ID from URL params
    const result = await BrandDeleteService(brandId);
    return res.status(200).json(result);
  } catch (e) {
    return res.status(500).json({ status: "fail", message: e.toString() });
  }
};

// ====================== Category All Controller ====================== //
exports.AddCategory = async (req, res) => {
  try {
    const result = await CategoryAddService(req); // Call the service to handle the logic
    return res.status(200).json(result); // Send the response to the client
  } catch (error) {
    console.error("Error in AddCategory controller:", error);
    return res
      .status(500)
      .json({ status: "fail", message: "Error adding category." });
  }
};

exports.CategoryList = async (req, res) => {
  try {
    let result = await CategoryListService();
    return res.status(200).json(result); // Ensure JSON response
  } catch (e) {
    return res.status(500).json({ status: "Fail", data: e.toString() }); // Ensure JSON error response
  }
};

exports.CategoryUpdate = async (req, res) => {
  try {
    const result = await CategoryUpdateService(req);

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

exports.CategoryDelete = async (req, res) => {
  try {
    const categoryId = req.params.id; // Ensure this matches the route parameter
    const result = await CategoryDeleteService(categoryId);
    return res.status(200).json(result);
  } catch (e) {
    return res.status(500).json({ status: "fail", message: e.toString() });
  }
};

// ====================== Sub Category All Controller ====================== //
exports.AddSubCategory = async (req, res) => {
  try {
    const result = await SubCategoryAddService(req);
    if (result.status === "success") {
      return res.status(200).json(result);
    } else {
      return res.status(400).json(result); // Respond with error if add fails
    }
  } catch (error) {
    console.error("Error in AddSubCategory controller:", error);
    return res
      .status(500)
      .json({ status: "fail", message: "Error adding sub-category." });
  }
};

exports.SubCategoryList = async (req, res) => {
  try {
    let result = await SubCategoryListService();
    return res.status(200).json(result); // Ensure JSON response
  } catch (e) {
    return res.status(500).json({ status: "Fail", data: e.toString() }); // Ensure JSON error response
  }
};

exports.SubCategoryUpdate = async (req, res) => {
  try {
    const result = await SubCategoryUpdateService(req);

    if (result.status === "success") {
      return res.status(200).json(result.data); // Ensure updated sub category data is sent back
    } else {
      return res.status(400).json({ status: "fail", message: result.message });
    }
  } catch (e) {
    console.error("Error:", e);
    return res.status(500).json({ status: "Fail", message: e.toString() });
  }
};

exports.SubCategoryDelete = async (req, res) => {
  try {
    const subCategoryId = req.params.id; // Get the Sub Category ID from URL params
    const result = await SubCategoryDeleteService(subCategoryId);
    return res.status(200).json(result);
  } catch (e) {
    return res.status(500).json({ status: "fail", message: e.toString() });
  }
};

// ====================== Add Product All Controller ====================== //
exports.AddProduct = async (req, res) => {
  try {
    const result = await ProductAddService(req);
    if (result.status === "success") {
      return res.status(200).json(result);
    } else {
      return res.status(400).json(result); // Respond with error if add fails
    }
  } catch (error) {
    console.error("Error in AddProduct controller:", error);
    return res
      .status(500)
      .json({ status: "fail", message: "Error adding product." });
  }
};

exports.ProductList = async (req, res) => {
  try {
    let result = await ProductListService();
    return res.status(200).json(result); // Ensure JSON response
  } catch (e) {
    return res.status(500).json({ status: "Fail", data: e.toString() }); // Ensure JSON error response
  }
};

exports.ProductDetails = async (req, res) => {
  const id = req.params.id;

  try {
    let result = await ProductDetailsService(id);
    return res.status(200).json(result); // Ensure JSON response
  } catch (e) {
    return res.status(500).json({ status: "Fail", data: e.toString() }); // Ensure JSON error response
  }
};

exports.ProductUpdate = async (req, res) => {
  try {

    // Make sure the 'id' parameter is extracted from the URL correctly
    const result = await ProductUpdateService(req);

    if (result.status === "success") {
      return res.status(200).json(result.data); // Send updated product data back
    } else {
      return res.status(400).json({ status: "fail", message: result.message });
    }
  } catch (e) {
    console.error("Error:", e);
    return res.status(500).json({ status: "fail", message: e.toString() });
  }
};

exports.ProductDelete = async (req, res) => {
  try {
    const productId = req.params.id; // Get the Product ID from URL params
    const result = await ProductDeleteService(productId);
    return res.status(200).json(result);
  } catch (e) {
    return res.status(500).json({ status: "fail", message: e.toString() });
  }
};
