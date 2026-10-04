import mongoose from "mongoose";

const panelUserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      default: "panel_user",
      enum: ["admin", "moderator", "panel_user"],
    },
    allowedRoles: [
      {
        type: String,
        required: true,
        enum: ["admin", "moderator", "panel_user"],
      },
    ],
    flags: {
      isActive: { type: Boolean, default: true },
      isDeleted: { type: Boolean, default: false },
    },
  },
  {
    timestamps: true,
    _v: false,
  },
);

export default mongoose.model("PanelUser", panelUserSchema);
