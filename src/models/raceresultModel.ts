import mongoose from "mongoose";

const raceResultSchema = new mongoose.Schema(
  {
    position: {
      type: Number,
      required: true,
    },
    driver: {
      type: [mongoose.Types.ObjectId],
      ref: "Driver",
      required: true,
    },
    time: {
      type: Number,
      required: true,
    },
    points: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const RaceResult = mongoose.model("RaceResult", raceResultSchema);
