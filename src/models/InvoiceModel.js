const mongoose = require("mongoose");
const DataSchema = mongoose.Schema(
  {
    payable: { type: String, required: true },
    order_status: { type: String, required: true },
    payment_status: { type: String, required: true },
    total: { type: String, required: true },
  },
  { timestamps: true, versionKey: false }
);
const InvoiceModel = mongoose.model("invoices", DataSchema);
module.exports = InvoiceModel;
