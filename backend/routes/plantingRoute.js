import express from "express";
import { Planting } from "../models/plantingModel.js";
import { UserAccount } from "../models/userAccountModel.js";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/complete", async (req, res) => {
  try {
    if (
      !req.body.token ||
      !req.body.treeId ||
      !req.body.tag ||
      !req.body.duration ||
      !req.body.start ||
      !req.body.end ||
      !req.body.status
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userObj = jwt.verify(req.body.token, process.env.ACCESS_TOKEN_SECRET);

    if (!userObj) {
      return res.status(400).json({ message: "Invalid token" });
    }

    const userInfo = await UserAccount.findOne({ username: userObj.username });

    const planting = await Planting.create({
      userId: userInfo._id,
      treeId: req.body.treeId,
      tag: req.body.tag,
      duration: req.body.duration,
      start: req.body.start,
      end: req.body.end,
      status: req.body.status,
    });
    res.status(201).json(planting);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/get-all", async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userObj = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (!userObj) {
      return res.status(400).json({ message: "Invalid token" });
    }

    const userInfo = await UserAccount.findOne({ username: userObj.username });

    const plantings = await Planting.find({ userId: userInfo._id });
    res.status(200).json(plantings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Router for getting by hours
router.get("/get-by-hours", async (req, res) => {
  try {
    const { date } = req.query;
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!date || !token) {
      return res
        .status(400)
        .json({ message: "Date and authorization token are required" });
    }

    const userObj = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (!userObj) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const userInfo = await UserAccount.findOne({ username: userObj.username });
    const adjustedDate = new Date(date);
    let hourlyPlantings = new Array(24).fill(0);

    for (let i = 0; i < 24; i++) {
      // Calculate the start and end times in milliseconds for the current hour
      const start = new Date(adjustedDate).getTime() + i * 60 * 60 * 1000; // Adds i hours in ms
      const end = start + 60 * 60 * 1000; // Adds 1 hour in ms

      // Convert start and end back to Date objects for the query
      const startDate = new Date(start);
      const endDate = new Date(end);

      const localHour = new Date(startDate).getHours();

      // Fetch plantings that start within the current hour interval
      const plantings = await Planting.find({
        userId: userInfo._id,
        start: { $gte: startDate, $lt: endDate },
      });

      if (plantings.length > 0) {
        const totalSeconds = plantings.reduce((acc, planting) => {
          return acc + planting.duration;
        }, 0);

        // Store total planting time for the current hour
        hourlyPlantings[localHour] = totalSeconds;
      }
    }

    res.status(200).json(hourlyPlantings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Router for getting by day
router.get("/get-by-day", async (req, res) => {
  try {
    const { date } = req.query; // Changed from req.body to req.query
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!date || !token) {
      return res
        .status(400)
        .json({ message: "Date and authorization token are required" });
    }

    const userObj = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (!userObj) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const userInfo = await UserAccount.findOne({ username: userObj.username });

    // Create start and end date for the given date
    const startDate = new Date(date);
    startDate.setUTCHours(0, 0, 0, 0);

    const endDate = new Date(date);
    endDate.setUTCHours(23, 59, 59, 999);

    const plantings = await Planting.find({
      userId: userInfo._id,
      start: { $gte: startDate, $lte: endDate },
    });

    res.status(200).json({
      count: plantings.length,
      data: plantings,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Router for getting by week
router.get("/get-by-week", async (req, res) => {
  try {
    const { dates } = req.query; // List of days in a week ['2024-09-07',...,'2024-09-14']
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!dates || !token) {
      return res
        .status(400)
        .json({ message: "Date and authorization token are required" });
    }

    const userObj = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (!userObj) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const userInfo = await UserAccount.findOne({ username: userObj.username });
    const weekData = [];

    for (let i = 0; i < 7; i++) {
      const date = dates[i];
      const startDate = new Date(date);
      startDate.setUTCHours(0, 0, 0, 0);

      const endDate = new Date(date);
      endDate.setUTCHours(23, 59, 59, 999);

      const plantings = await Planting.find({
        userId: userInfo._id,
        start: { $gte: startDate, $lte: endDate },
      });

      const totalSeconds = plantings.reduce((acc, planting) => {
        return acc + planting.duration;
      }, 0);

      weekData.push({
        date: startDate.getDay(), // 0 -> 6: Sun -> Sat
        totalSeconds: totalSeconds,
        count: plantings.length,
        data: plantings,
      });
    }

    res.status(200).json(weekData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Router for getting by month
router.get("/get-by-month", async (req, res) => {
  try {
    const { date } = req.query; // A specific month + year - Ex: 2024-09
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!date || !token) {
      return res
        .status(400)
        .json({ message: "Date and authorization token are required" });
    }

    const userObj = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (!userObj) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const userInfo = await UserAccount.findOne({ username: userObj.username });
    const monthData = [];
    const adjustedDate = new Date(date);
    const numberOfDays = new Date(
      adjustedDate.getFullYear(),
      adjustedDate.getMonth() + 1,
      0
    ).getDate();

    for (let i = 1; i <= numberOfDays; i++) {
      // https://www.geeksforgeeks.org/how-to-get-the-first-and-last-date-of-current-month-using-javascript/
      // https://stackoverflow.com/questions/1184334/get-number-days-in-a-specified-month-using-javascript
      const st = new Date(
        Date.UTC(adjustedDate.getFullYear(), adjustedDate.getMonth(), i)
      );

      const startDate = new Date(st);

      const endDate = new Date(st);
      endDate.setUTCHours(23, 59, 59, 999);

      const plantings = await Planting.find({
        userId: userInfo._id,
        start: { $gte: startDate, $lt: endDate },
      });

      const totalSeconds = plantings.reduce(
        (acc, curr) => acc + curr.duration,
        0
      );

      monthData.push({
        date: i,
        totalSeconds: totalSeconds,
        count: plantings.length,
        data: plantings,
      });
    }
    res.status(200).json(monthData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Router for getting by year

export default router;
