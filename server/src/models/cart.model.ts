import mongoose from "mongoose";

const cartProductSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    price: Number,
    quantity: Number,
    total: Number,
    discountPercentage: Number,
    discountedTotal: Number,
    thumbnail: String,
  },
  { _id: false },
);

const cartSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    products: [cartProductSchema],
    total: Number,
    discountedTotal: Number,
    userId: {
      type: Number,
      required: true,
      index: true,
    },
    totalProducts: Number,
    totalQuantity: Number,
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Cart", cartSchema);
