import mongoose from "mongoose";

const circuitSchema = new mongoose.Schema(
  {
    circuit_id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
    },
    location: {
      country: {
        type: String,
        required: true,
        trim: true,
      },
      city: {
        type: String,
        required: true,
        trim: true,
      },
    },
    length_km: {
      type: Number,
      required: true,
    },
    turns: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Circuit = mongoose.model("Circuit", circuitSchema);
