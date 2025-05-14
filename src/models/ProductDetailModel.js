const mongoose = require("mongoose");
const DataSchema = mongoose.Schema(
  {
    keyFeature: { type: String },
    specification: { type: String },
    description: { type: String },
    productImgs: { type: [String] },

    productID: { type: mongoose.Schema.Types.ObjectId, ref: "products" },
  },
  { timestamps: true, versionKey: false }
);
const ProductDetailsModel = mongoose.model("productdetails", DataSchema);
module.exports = ProductDetailsModel;
