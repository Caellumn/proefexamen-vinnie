import express from "express";
import { getRaces } from "../controllers/raceController";

const router = express.Router();

router.get("/", getRaces);

export default router;
