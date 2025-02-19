import { Request, Response } from "express";
import { Race } from "../models/raceModel";
import { Error as MongooseError } from "mongoose";
const { ValidationError } = MongooseError;

// Utility function to format milliseconds to hh:mm:ss:ms
const formatMillisecondsToTime = (milliseconds: number): string => {
  const hours = Math.floor(milliseconds / 3600000);
  const minutes = Math.floor((milliseconds % 3600000) / 60000);
  const seconds = Math.floor((milliseconds % 60000) / 1000);
  const ms = milliseconds % 1000;
  // Pad hours, minutes, and seconds with 2 digits and ms with 3 digits
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}:${String(seconds).padStart(2, "0")}:${String(ms).padStart(3, "0")}`;
};

export const getRaces = async (req: Request, res: Response) => {
  try {
    // Use .lean() to get plain objects
    const races = await Race.find().lean();

    const formattedRaces = races.map((race: any) => {
      if (Array.isArray(race.race_results)) {
        race.race_results = race.race_results.map(
          (result: any, index: number) => {
            const timeInMs = Number(result.time);
            if (index === 0) {
              return {
                ...result,
                time: formatMillisecondsToTime(timeInMs),
              };
            } else {
              return {
                ...result,
                time: (timeInMs / 1000).toFixed(3),
              };
            }
          }
        );
      }
      return race;
    });

    res.status(200).json(formattedRaces);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Something went wrong" });
    }
  }
};
