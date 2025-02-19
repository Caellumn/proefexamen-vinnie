import mongoose from "mongoose";
import { RaceResult } from "./raceresultModel";

const raceSchema = new mongoose.Schema(
  {
    round: {
      type: Number,
      required: true,
    },
    circuit_id: {
      type: [mongoose.Types.ObjectId],
      ref: "Circuit",
      required: true,
      default: [],
    },
    date: {
      type: String,
      required: true,
    },
    sprint_race: {
      type: Boolean,
      required: true,
    },
    fastest_lap: {
      type: [mongoose.Types.ObjectId],
      ref: "Driver",
      required: true,
      default: [],
    },
    // race_results: {
    //   type: [mongoose.Types.ObjectId],
    //   ref: "RaceResult",
    //   required: true,
    //   default: [],
    // },
    race_results: {
      type: [RaceResult.schema],
      required: true,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const Race = mongoose.model("Race", raceSchema);
