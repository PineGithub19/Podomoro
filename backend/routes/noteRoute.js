import express from "express";
import { Note } from "../models/noteModel.js";
import { UserAccount } from "../models/userAccountModel.js";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/create", async (req, res) => {
  try {
    if (
      req.body.checked === undefined ||
      req.body.checked === null ||
      !req.body.description
    ) {
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

      const note = await Note.create({
        userId: userInfo._id,
        checked: req.body.checked,
        description: req.body.description,
      });

      res.status(201).json(note);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/get-notes", async (req, res) => {
  try {
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
    const note = await Note.find({ userId: userInfo._id });
    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/update-note/:id", async (req, res) => {
  try {
    // if (
    //   req.body.checked === undefined ||
    //   req.body.checked === null ||
    //   !req.body.description
    // ) {
    //   return res.status(400).json({ message: "All fields are required" });
    // }

    const { id } = req.params;
    const result = await Note.findByIdAndUpdate(id, req.body);

    if (!result) {
      return res.status(404).json({ message: "Note not found" });
    }
    return res.status(200).json({ message: "Note updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/delete-note/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Note.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ message: "Note not found" });
    }
    return res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
