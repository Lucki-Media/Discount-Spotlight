import mongoose from "mongoose";
const ShopifySessionsSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
    },
    shop: {
      type: String,
    },
    state: {
      type: String,
    },
    isOnline: {
      type: String,
    },
    scope: {
      type: String,
    },
    accessToken: {
      type: String,
    },
  },
  { timestamps: true }
);

const ShopifySessions = mongoose.model(
  "shopify_sessions",
  ShopifySessionsSchema
);
export default ShopifySessions;
