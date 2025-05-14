const mongoose = require("mongoose");

const DataSchema = mongoose.Schema(
  {
    productCode: { type: String },
    productName: { type: String },
    productStatus: { type: String },
    price: { type: Number, min: 0 },
    discountPrice: { type: Number, default: 0, min: 0 },
    stock: { type: Number, min: 0 },
    badge: { type: String },
    color: { type: [String] },
    productImg: { type: String },

    brandID: { type: mongoose.Schema.Types.ObjectId, ref: "brands" },
    categoryID: { type: mongoose.Schema.Types.ObjectId, ref: "categories" },
    subCategoryID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "subcategories",
    },
  },
  { timestamps: true, versionKey: false }
);

const ProductModel = mongoose.model("products", DataSchema);
module.exports = ProductModel;
