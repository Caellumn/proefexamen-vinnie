import { Request, Response } from "express";
import { Race } from "../models/raceModel";
import { Driver } from "../models/driverModel";
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
  )}:${String(seconds).padStart(2, "0")}.${String(ms).padStart(3, "0")}`;
};

export const getRaces = async (req: Request, res: Response) => {
  try {
    // Check if the format query parameter is set to true
    const shouldFormat = req.query.format === "true";

    const races = await Race.find();
    // Step 2: Collect all unique driver_ids from all races' race_results
    const driverIds = races.flatMap((race) =>
      race.race_results.map((result) => result.driver_id)
    );
    // Step 3: Fetch all drivers based on the collected driver_ids
    const drivers = await Driver.find({ driver_id: { $in: driverIds } });
    // Step 4: Create a lookup map for easy access to driver details
    const driverMap = new Map();
    drivers.forEach((driver) => {
      driverMap.set(driver.driver_id, driver);
    });
    // Step 5: Merge driver details into race results for all races
    const racesWithDriverDetails = races.map((race) => {
      const raceResultsWithDriverDetails = race.race_results.map(
        (result, index) => {
          const driverDetails = driverMap.get(result.driver_id);
          // Apply time formatting only when requested
          const formattedTime = shouldFormat
            ? index === 0
              ? formatMillisecondsToTime(result.time)
              : (result.time / 1000).toFixed(3)
            : result.time;

          return {
            ...result.toObject(), // Convert Mongoose document to plain JavaScript object
            time: formattedTime,
            driver_id: driverDetails
              ? {
                  driver_id: driverDetails.driver_id,
                  name: driverDetails.givenName,
                  lastName: driverDetails.familyName,
                  nationality: driverDetails.nationality,
                  countryFlag: `https://purecatamphetamine.github.io/country-flag-icons/3x2/${driverDetails.countryCode}.svg`,
                }
              : null,
          };
        }
      );
      // Return the race with merged race results
      return {
        ...race.toObject(), // Convert the race document to a plain object
        race_results: raceResultsWithDriverDetails,
      };
    });
    res.status(200).json(racesWithDriverDetails);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Something went wrong" });
    }
  }
};
