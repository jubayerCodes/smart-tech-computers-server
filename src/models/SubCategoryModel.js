const mongoose = require("mongoose");
const DataSchema = mongoose.Schema(
    {
        subCategoryName: { type: String, required: true },
        status: { type: String },
        categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'categories' }
    },
    { timestamps: true, versionKey: false }
);
const SubCategoryModel = mongoose.model("subcategories", DataSchema);
module.exports = SubCategoryModel;
