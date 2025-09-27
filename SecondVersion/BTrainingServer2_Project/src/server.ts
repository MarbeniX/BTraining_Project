import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import morgan from "morgan";
import cloudinary from "./config/cloudinary";
import authRoutes from "./routes/authRoutes";
import profileRoutes from "./routes/profileRoutes";
import exerciseRoutes from "./routes/admin/exerciseRoutes";
import routineRoutes from "./routes/routineRoutes";
import trainingSessionRoutes from "./routes/trainingSession";
import { consConfig } from "./config/cors";
import { connectDB } from "./config/db";

connectDB();

const app = express();
app.use(cors(consConfig));
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/admin/exercise", exerciseRoutes);
app.use("/api/routine", routineRoutes);
app.use("/api/session", trainingSessionRoutes);

export default app;
