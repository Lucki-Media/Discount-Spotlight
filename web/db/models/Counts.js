import mongoose from "mongoose";
const CountSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
    },
    shop: {
      type: String,
    },
    counts: {
        year: {
          type: String,
          default: "",
        },
        count_data: {
            jan: {
                type: Number,
                default: 0,
            },
            feb: {
                type: Number,
                default: 0,
            },
            mar: {
                type: Number,
                default: 0,
            },
            apr: {
                type: Number,
                default: 0,
            },
            may: {
                type: Number,
                default: 0,
            },
            jun: {
                type: Number,
                default: 0,
            },
            jul: {
                type: Number,
                default: 0,
            },
            aug: {
                type: Number,
                default: 0,
            },
            sep: {
                type: Number,
                default: 0,
            },
            oct: {
                type: Number,
                default: 0,
            },
            nov: {
                type: Number,
                default: 0,
            },
            dec: {
                type: Number,
                default: 0,
            },
        },
      },
  },
  { timestamps: true }
);

const Count = mongoose.model(
  "counts",
  CountSchema
);
export default Count;
