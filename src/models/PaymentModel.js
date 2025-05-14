const mongoose = require("mongoose");
const DataSchema = mongoose.Schema(
  {
    orderID: {type: String, required: true},
    invoiceID: {type: String, required: true},
    billingDetailID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "billingdetails" },
    subTotal: { type: String, required: true },
    discount: { type: String, required: true },
    grandTotal: { type: String, required: true },
    pay_method: { type: String, required: true },
    tran_id: { type: String },
    acc_number: { type: String },
    payment_status: { type: String, required: true },
  },
  { timestamps: true, versionKey: false }
);
const PaymentModel = mongoose.model("payments", DataSchema);
module.exports = PaymentModel;
