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

export default router;
