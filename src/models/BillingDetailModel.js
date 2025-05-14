const mongoose = require("mongoose");
const DataSchema = mongoose.Schema(
    {
    cus_name: { type: String, required: true },
    cus_address: { type: String, required: true },
    cus_phone: { type: String, required: true },
    cus_email: { type: String, required: true },
    cus_city: { type: String, required: true },
    order_notes: { type: String},
    },
    { timestamps: true, versionKey: false }
);
const BillingDetailModel = mongoose.model("billingdetails", DataSchema);
module.exports = BillingDetailModel;
