const mongoose = require("mongoose");
const DataSchema = mongoose.Schema(
  {
    title: { type: String },
    des: { type: String },
    status: { type: String },
    slideImg: { type: String },
  },
  { timestamps: true, versionKey: false }
);
const HeroSliderModel = mongoose.model("herosliders", DataSchema);
module.exports = HeroSliderModel;
