import { Request, Response } from "express";
import { Team } from "../models/teamModel";
import { Driver } from "../models/driverModel";
import { Error as MongooseError } from "mongoose";
const { ValidationError } = MongooseError;

export const getTeams = async (req: Request, res: Response) => {
  try {
    const teams = await Team.find().populate("drivers");

    const driverIds = teams.flatMap((team) =>
      team.drivers.map((drivers) => drivers.driver_id)
    );

    const drivers = await Driver.find({ driver_id: { $in: driverIds } });

    const driverMap = new Map();
    drivers.forEach((driver) => {
      driverMap.set(driver.driver_id, driver);
    });

    const teamsWithDriverDetails = teams.map((team) => {
      const raceResultsWithDriverDetails = team.drivers.map((result, index) => {
        const teamDetails = driverMap.get(result.driver_id);

        return {
          ...result.toObject(),
          driver_id: teamDetails
            ? {
                driver_id: teamDetails.driver_id,
                countryflag: `https://purecatamphetamine.github.io/country-flag-icons/3x2/${teamDetails.countryCode}.svg`,
                name: teamDetails.name,
                lastName: teamDetails.familyName,
                nationality: teamDetails.nationality,
              }
            : null,
        };
      });

      return {
        ...team.toObject(),
        drivers: raceResultsWithDriverDetails,
      };
    });

    res.status(200).json(teamsWithDriverDetails);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Something went wrong" });
    }
  }
};
