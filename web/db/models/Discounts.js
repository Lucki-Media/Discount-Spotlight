import mongoose from "mongoose";
const ProductDiscountSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
    },
    shop: {
      type: String,
    },
    product_id: {
      type: String,
    },
    product_image: {
      type: String,
    },
    product_name: {
      type: String,
    },
    discounts: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const ProductDiscount = mongoose.model(
  "product_discounts",
  ProductDiscountSchema
);
export default ProductDiscount;
