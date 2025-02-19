import { Request, Response } from "express";
import { Circuit } from "../models/circuitModel";
import { Error as MongooseError } from "mongoose";
const { ValidationError } = MongooseError;

export const getCircuits = async (req: Request, res: Response) => {
  try {
    const searchQuery = req.query.search as string;
    let query = {};

    if (searchQuery) {
      query = { "location.country": { $regex: new RegExp(searchQuery, "i") } };
    }

    const circuits = await Circuit.find(query);

    res.status(201).json(circuits);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Something went wrong" });
    }
  }
};
