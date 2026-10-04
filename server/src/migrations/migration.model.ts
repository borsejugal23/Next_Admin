import { Schema, model, models } from "mongoose";

const migrationSchema = new Schema(
  {
    migrationId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    executedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: "migrations",
    versionKey: false,
    timestamps: false,
  },
);

export const MigrationModel =
  models.Migration || model("Migration", migrationSchema);
