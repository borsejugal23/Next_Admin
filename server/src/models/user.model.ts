import mongoose from "mongoose";

const coordinatesSchema = new mongoose.Schema(
  {
    lat: Number,
    lng: Number,
  },
  { _id: false },
);

const addressSchema = new mongoose.Schema(
  {
    address: String,
    city: String,
    state: String,
    stateCode: String,
    postalCode: String,
    country: String,
    coordinates: coordinatesSchema,
  },
  { _id: false },
);

const bankSchema = new mongoose.Schema(
  {
    cardExpire: String,
    cardNumber: String,
    cardType: String,
    currency: String,
    iban: String,
  },
  { _id: false },
);

const companySchema = new mongoose.Schema(
  {
    department: String,
    name: String,
    title: String,
    address: addressSchema,
  },
  { _id: false },
);

const cryptoSchema = new mongoose.Schema(
  {
    coin: String,
    wallet: String,
    network: String,
  },
  { _id: false },
);

const hairSchema = new mongoose.Schema(
  {
    color: String,
    type: String,
  },
  { _id: false },
);

const userSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    maidenName: String,
    age: Number,
    gender: String,
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    phone: String,
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: String,
    birthDate: Date,
    image: {
      type: String,
      required: true,
    },
    bloodGroup: String,
    height: Number,
    weight: Number,
    eyeColor: String,
    ein: String,
    ssn: String,
    university: String,
    role: {
      type: String,
      enum: ["admin", "moderator", "user"],
      default: "user",
    },
    ip: String,
    macAddress: String,
    userAgent: String,
    address: addressSchema,
    bank: bankSchema,
    company: companySchema,
    crypto: cryptoSchema,
    hair: hairSchema,
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("User", userSchema);
