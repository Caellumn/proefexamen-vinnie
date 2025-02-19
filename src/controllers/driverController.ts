import { Request, Response } from "express";
import { Driver } from "../models/driverModel";
import { Error as MongooseError } from "mongoose";
const { ValidationError } = MongooseError;

export const getDrivers = async (req: Request, res: Response) => {
  try {
    const drivers = await Driver.find();

    // Convert each driver to a plain object and update the countryCode to the flag URL
    const updatedDrivers = drivers.map((driver) => {
      // Convert Mongoose document to a plain JS object if needed
      const driverObj = driver.toObject();
      driverObj.countryCode = `https://purecatamphetamine.github.io/country-flag-icons/3x2/${driverObj.countryCode}.svg`;
      return driverObj;
    });

    // driver op naam + familienaam
    if (req.query.search) {
      const searchStr = (req.query.search as string).toLowerCase();
      const filteredDrivers = updatedDrivers.filter((driver) => {
        return (
          driver.familyName.toLowerCase().includes(searchStr) ||
          driver.givenName.toLowerCase().includes(searchStr)
        );
      });

      res.status(200).json(filteredDrivers);
    } else {
      res.status(200).json(updatedDrivers);
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Something went wrong" });
    }
  }
};
