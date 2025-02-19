import { Request, Response } from "express";
import { Race } from "../models/raceModel";
import { Error as MongooseError } from "mongoose";
const { ValidationError } = MongooseError;

// Function to convert milliseconds to a formatted time string
const formatMillisecondsToTime = (milliseconds: number): string => {
  const hours = Math.floor(milliseconds / 3600000);
  const minutes = Math.floor((milliseconds % 3600000) / 60000);
  const seconds = Math.floor((milliseconds % 60000) / 1000);
  const ms = milliseconds % 1000;
  // Pad hours, minutes, seconds, and milliseconds with zeros
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}:${String(seconds).padStart(2, "0")}:${String(ms).padStart(3, "0")}`;
};

export const getRaces = async (req: Request, res: Response) => {
  try {
    // Use .lean() to get plain JavaScript objects from the database
    const races = await Race.find().lean().lean();

    // Only format the race times if the query parameter ?format=true is provided
    if (req.query.format === "true") {
      const formattedRaces = races.map((race: any) => {
        if (Array.isArray(race.race_results)) {
          race.race_results = race.race_results.map(
            (result: any, index: number) => {
              const timeInMs = Number(result.time);
              // For the first result, format the time using the custom function
              if (index === 0) {
                return {
                  ...result,
                  time: formatMillisecondsToTime(timeInMs),
                };
              } else {
                // For the other results, convert the time to seconds with 3 decimals
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
    } else {
      res.status(200).json(races);
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Something went wrong" });
    }
  }
};
