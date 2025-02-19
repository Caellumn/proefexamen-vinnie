import express from "express";
import { getCircuits } from "../controllers/circuitController";

const router = express.Router();

router.get("/", getCircuits);

export default router;
