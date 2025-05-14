const mongoose = require("mongoose");
const DataSchema = mongoose.Schema(
  {
    productID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "products" },
    billingDetailID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "billingdetails" },
    orderID: { type: String, required: true },
    invoiceID: { type: String, required: true },
    qty: { type: String, required: true },
    color: { type: String },
  },
  { timestamps: true, versionKey: false }
);
const InvoiceProductModel = mongoose.model("invoiceproducts", DataSchema);
module.exports = InvoiceProductModel;
