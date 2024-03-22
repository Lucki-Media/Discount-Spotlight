import mongoose from "mongoose";
const ChargeSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
    },
    charge_id: {
      type: Number,
    },
    test: {
      type: Number,
    },
    status: {
      type: String,
    },
    name: {
      type: String,
    },
    terms: {
      type: String,
    },
    type: {
      type: String,
    },
    price: {
      type: Number,
    },
    interval: {
      type: String,
    },
    capped_amount: {
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
    expires_on: {
      type: Date,
    },
    plan_id: {
      type: Number,
    },
    description: {
      type: String,
    },
    reference_charge: {
      type: Number,
    },
    deleted_at: {
      type: Date,
    },
    user_id: {
      type: Number,
    },
    shop: {
      type: String,
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
