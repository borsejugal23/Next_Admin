import Product from "../../models/product.model";
import { Migration } from "../types";

const addProductIndexesMigration: Migration = {
  id: "20260805-add-product-indexes",

  description: "Creates indexes for product title and category.",

  async up(): Promise<void> {
    console.log("Creating title index...");

    await Product.collection.createIndex({
      title: 1,
    });

    console.log("Creating category index...");

    await Product.collection.createIndex({
      category: 1,
    });

    console.log("Indexes created successfully.");
  },
};

export default addProductIndexesMigration;
