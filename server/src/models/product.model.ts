import mongoose from "mongoose";

const dimensionsSchema = new mongoose.Schema(
  {
    width: Number,
    height: Number,
    depth: Number,
  },
  { _id: false },
);

const reviewSchema = new mongoose.Schema(
  {
    rating: Number,
    comment: String,
    date: Date,
    reviewerName: String,
    reviewerEmail: String,
  },
  { _id: true },
);

const metaSchema = new mongoose.Schema(
  {
    createdAt: Date,
    updatedAt: Date,
    barcode: String,
    qrCode: String,
  },
  { _id: false },
);

const productSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: String,
    category: {
      type: String,
      trim: true,
      index: true,
    },
    price: Number,
    discountPercentage: Number,
    rating: Number,
    stock: Number,
    tags: [String],
    brand: String,
    sku: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    weight: Number,
    dimensions: dimensionsSchema,
    warrantyInformation: String,
    shippingInformation: String,
    availabilityStatus: String,
    reviews: [reviewSchema],
    returnPolicy: String,
    minimumOrderQuantity: Number,
    meta: metaSchema,
    images: [String],
    thumbnail: String,
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Product", productSchema);
