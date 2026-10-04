import { Migration } from "./types";
import addReviewIdMigration from "./scripts/20260731-add-review-id";
import addProductIndexesMigration from "./scripts/20260805-add-product-indexes";

export const migrations: Migration[] = [
  //   addReviewIdMigration,
  addProductIndexesMigration,
];
