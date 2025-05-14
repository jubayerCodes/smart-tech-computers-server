const mongoose = require("mongoose");
const DataSchema = mongoose.Schema(
  {
    productID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "products" },
    oldStock: { type: Number, required: true },
    newStock: { type: Number, required: true },
    stockDate: {type: Date, required: true},

  },
  { timestamps: true, versionKey: false }
);
const StockModel = mongoose.model("stocks", DataSchema);
module.exports = StockModel;