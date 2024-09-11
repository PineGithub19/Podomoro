import express from "express";
import { Tag } from "../models/tagModel.js";
import { UserAccount } from "../models/userAccountModel.js";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/create", async (req, res) => {
  try {
    if (!req.body.name || !req.body.color) {
      return res.status(500).json({ message: "All fieldsare required" });
    }

    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token) {
      const userObj = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      if (!userObj) {
        return res.status(401).json({ message: "Invalid token" });
      }

      const userInfo = await UserAccount.findOne({
        username: userObj.username,
      });

      const tag = await Tag.create({
        name: req.body.name,
        color: req.body.color,
        userId: userInfo._id,
      });
      res.status(201).json(tag);
    } else {
      const tag = await Tag.create({
        name: req.body.name,
        color: req.body.color,
        userId: "None",
      });
      res.status(201).json(tag);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/get-common-tags", async (req, res) => {
  try {
    const tags = await Tag.find({
      userId: "None",
    });
    res.status(200).json(tags);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Router for getting tag of a specific user
router.get("/get-tags", async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      return res
        .status(400)
        .json({ message: "Date and authorization token are required" });
    }

    const userObj = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (!userObj) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const userInfo = await UserAccount.findOne({ username: userObj.username });
    const tags = await Tag.find({ userId: userInfo._id });
    res.status(200).json(tags);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Router for getting tags by search name
router.get("/get-tags-by-name", async (req, res) => {
  try {
    const { tagName } = req.query;
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      return res
        .status(400)
        .json({ message: "Authorization token are required" });
    }

    const userObj = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (!userObj) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const userInfo = await UserAccount.findOne({ username: userObj.username });

    if (tagName !== "") {
      const tags = await Tag.find({
        name: { $regex: tagName, $options: "i" },
        $or: [{ userId: userInfo._id }, { userId: "None" }],
      });

      res.status(200).json(tags);
    } else if (tagName === "") {
      const tags = await Tag.find({
        $or: [{ userId: userInfo._id }, { userId: "None" }],
      });
      res.status(200).json(tags);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
