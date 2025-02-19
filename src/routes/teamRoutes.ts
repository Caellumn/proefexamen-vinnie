import express from "express";
import { getTeams } from "../controllers/teamController";

const router = express.Router();

router.get("/", getTeams);

export default router;
