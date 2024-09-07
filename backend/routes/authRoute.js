import dotenv from "dotenv";
import express from "express";
import { UserAccount } from "../models/userAccountModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

dotenv.config();
const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const checkUsername = await UserAccount.findOne({
      username: req.body.username,
    });

    if (checkUsername) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const user = await UserAccount.create({
      username: req.body.username,
      password: hashedPassword,
      email: req.body.email,
    });
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/logout", async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) return res.sendStatus(401);

    // Verify token before invalidating
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
      if (err) return res.sendStatus(403);

      // Remove the token from the user document
      await UserAccount.updateOne(
        { username: user.username },
        { $unset: { token: "" } }
      );

      res.sendStatus(204);
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const checkUser = await UserAccount.findOne({ username });

  if (!checkUser) {
    return res.status(401).json({ error: "User not found" });
  }

  try {
    if (await bcrypt.compare(req.body.password, checkUser.password)) {
      const user = { username: username, password: password };

      const accessToken = generateAccessToken(user);
      const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
      res.json({ accessToken: accessToken, refreshToken: refreshToken });
    } else {
      res.status(401).json({ error: "Wrong password" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });
}

export default router;
