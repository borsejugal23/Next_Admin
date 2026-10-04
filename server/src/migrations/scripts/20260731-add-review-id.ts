import mongoose from "mongoose";
import Product from "../../models/product.model";
import { Migration } from "../types";

const addReviewIdMigration: Migration = {
  id: "20260731-add-review-id",

  description: "Adds _id to embedded product reviews that are missing one.",

  async up(): Promise<void> {
    const products = await Product.find({
      "reviews._id": { $exists: false },
    }).lean();

    for (const product of products) {
      const reviews = product.reviews.map((review: any) => ({
        _id: review._id ?? new mongoose.Types.ObjectId(),
        ...review,
      }));

      await Product.updateOne({ _id: product._id }, { $set: { reviews } });
    }

    console.log(`Migrated ${products.length} product(s).`);
  },
};

export default addReviewIdMigration;
