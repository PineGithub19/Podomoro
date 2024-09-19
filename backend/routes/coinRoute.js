import express from "express";
import { UserAccount } from "../models/userAccountModel.js";
import { Coin } from "../models/coinModel.js";
import jwt from "jsonwebtoken";

const router = express.Router();

router.put("/my-coin/", async (req, res) => {
  try {
    if (
      !req.body.token ||
      req.body.coin === null ||
      req.body.coin === undefined
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const userObj = jwt.verify(req.body.token, process.env.ACCESS_TOKEN_SECRET);

    if (!userObj) {
      return res.status(400).json({ message: "Invalid token" });
    }

    const userInfo = await UserAccount.findOne({ username: userObj.username });
    const updatedCoin = await Coin.findOneAndUpdate(
      { userId: userInfo._id }, // Filter by userId
      { $set: { coin: req.body.coin } }, // Update the coin field
      { new: true } // Return the updated document
    );

    if (!updatedCoin) {
      return res.status(404).json({ message: "Coin not found" });
    }

    res.status(200).json({ message: "Coin updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/my-coin/", async (req, res) => {
  try {
    if (
      !req.body.token ||
      req.body.coin === null ||
      req.body.coin === undefined
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const userObj = jwt.verify(req.body.token, process.env.ACCESS_TOKEN_SECRET);

    if (!userObj) {
      return res.status(400).json({ message: "Invalid token" });
    }

    const userInfo = await UserAccount.findOne({ username: userObj.username });

    if (userInfo) {
      return res.status(400).json({ message: "Coin already exists" });
    }
    const coin = await Coin.create({
      userId: userInfo._id,
      coin: req.body.coin,
    });

    res.status(201).json(coin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/my-coin/", async (req, res) => {
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

    const coin = await Coin.find({ userId: userInfo._id });
    res.status(200).json(coin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
