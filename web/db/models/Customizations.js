import mongoose from "mongoose";
const CustomizationSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
    },
    shop: {
      type: String,
    },
    customizations_json: {
      type: String,
    },
  },
  { timestamps: true }
);

const Customization = mongoose.model(
  "customizations",
  CustomizationSchema
);
export default Customization;
