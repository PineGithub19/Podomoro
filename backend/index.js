import dotenv from "dotenv";
import express from "express";
import { PORT, mongoDBURL } from "./config.js";
import mongoose from "mongoose";
import cors from "cors";

import treeRoute from "./routes/treeRoute.js";
import authRoute from "./routes/authRoute.js";
import plantingRoute from "./routes/plantingRoute.js";
import tagRoute from "./routes/tagRoute.js";
import coinRoute from "./routes/coinRoute.js";
import noteRoute from "./routes/noteRoute.js";
import musicRoute from "./routes/musicRoute.js";

dotenv.config();
const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/auth", authRoute);

app.use("/trees", treeRoute);

app.use("/planting", plantingRoute);

app.use("/tag", tagRoute);

app.use("/coin", coinRoute);

app.use("/note", noteRoute);

app.use("/music", musicRoute);

mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

/**
 * podomoro
 * podomoro2024
 */
