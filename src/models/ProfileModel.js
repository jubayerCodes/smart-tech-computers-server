const mongoose = require("mongoose");
const DataSchema = mongoose.Schema(
  {
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    cus_name: { type: String },
    cus_address: { type: String },
    cus_city: { type: String },
    // ship_address: { type: String },
    // ship_city: { type: String },
    // ship_name: { type: String },
    // ship_postcode: { type: String },
    // ship_state: { type: String },
  },
  { timestamps: true, versionKey: false }
);
const ProfileModel = mongoose.model("profiles", DataSchema);
module.exports = ProfileModel;