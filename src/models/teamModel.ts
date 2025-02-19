import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
  {
    team_id: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    principal: {
      type: String,
      required: true,
      trim: true,
    },
    base: {
      type: String,
      required: true,
      trim: true,
    },
    founded_year: {
      type: Number,
      required: true,
    },
    engine: {
      type: String,
      required: true,
      trim: true,
    },
    drivers: {
      type: [mongoose.Types.ObjectId],
      ref: "Driver",
      required: true,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const Team = mongoose.model("Team", teamSchema);
