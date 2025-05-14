const mongoose = require("mongoose");
const DataSchema = mongoose.Schema(
    {
        categoryName: { type: String, unique: true, required: true },
        categoryImg: { type: String },
        status: { type: String },
        subCategories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'subcategories' }] // Add this line
    },
    { timestamps: true, versionKey: false }
);

const CategoryModel = mongoose.model("categories", DataSchema);
module.exports = CategoryModel;
