import mongoose from "mongoose";
const ChargeSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
    },
    shop: {
      type: String,
    },
    charge_id: {
      type: Number,
    },
    test: {
      type: Boolean,
    },
    status: {
      type: String,
    },
    name: {
      type: String,
    },
    price: {
      type: Number,
    },
    trial_days: {
      type: Number,
    },
    billing_on: {
      type: Date,
    },
    activated_on: {
      type: Date,
    },
    trial_ends_on: {
      type: Date,
    },
    cancelled_on: {
      type: Date,
    },
    plan_id: {
      type: Number,
    },
    plan_limit: {
      type: {
        productLimit: {
          type: Number,
          default: 10,
        },
        discountLimit: {
          type: Number,
          default: 3,
        },
      },
    },
  },
  { timestamps: true }
);

const Charge = mongoose.model("charges", ChargeSchema);
export default Charge;
