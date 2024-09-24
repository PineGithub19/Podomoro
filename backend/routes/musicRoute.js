import express from "express";
import { UserAccount } from "../models/userAccountModel.js";
import { Music } from "../models/musicModel.js";
import { MyMusic } from "../models/musicModel.js";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/create", async (req, res) => {
  try {
    if (
      !req.body.name ||
      !req.body.image ||
      !req.body.link ||
      req.body.coin === undefined ||
      !req.body.description
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (req.body.userId === "None") {
      // This is for common music for all users
      const music = await Music.create({
        name: req.body.name,
        image: req.body.image,
        link: req.body.link,
        coin: req.body.coin,
        description: req.body.description,
        userId: "None",
      });
      res.status(201).json(music);
    } else {
      const authHeader = req.headers["authorization"];
      const token = authHeader && authHeader.split(" ")[1];

      if (!token) {
        return res.status(400).json({ message: "Invalid token" });
      }

      const userObj = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      if (!userObj) {
        return res.status(400).json({ message: "Invalid token" });
      }

      const userInfo = await UserAccount.findOne({
        username: userObj.username,
      });

      const music = await Music.create({
        name: req.body.name,
        image: req.body.image,
        link: req.body.link,
        coin: req.body.coin,
        description: req.body.description,
        userId: userInfo._id,
      });

      res.status(201).json(music);
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

router.post("/create-newbie", async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(400).json({ message: "Invalid token" });
    }

    const userObj = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (!userObj) {
      return res.status(400).json({ message: "Invalid token" });
    }

    const userInfo = await UserAccount.findOne({
      username: userObj.username,
    });
    const basicMusic = await Music.findOne({
      name: "Rain on a frozen lake",
    });
    const hasMusic = await MyMusic.findOne({
      userId: userInfo._id,
      musicId: basicMusic._id,
    });

    if (!hasMusic) {
      const music = await MyMusic.create({
        musicId: basicMusic._id,
        buy: true,
        current: true,
        userId: userInfo._id,
      });

      res.status(200).json(music);
    } else {
      res.status(500).json({ message: "Not valid music for newbie" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const music = await Music.find({});
    res.status(200).json({
      count: music.length,
      data: music,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route for get all musics of a user which were bought
router.get("/current-music", async (req, res) => {
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

    const music = await MyMusic.find({ userId: userInfo._id });

    res.status(200).json(music);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route for get a music from id
router.get("/current-music/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await Music.findById(id);

    if (!result) {
      return res.status(404).json({ message: "Music not found" });
    }

    return res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Routes for a music status of a particular userAccount - myMusic Collection

router.post("/my-music", async (req, res) => {
  try {
    if (
      !req.body.musicId ||
      req.body.buy === undefined ||
      req.body.current === undefined
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

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

    const result = await MyMusic.create({
      musicId: req.body.musicId,
      buy: req.body.buy,
      current: req.body.current,
      userId: userInfo._id,
    });

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/my-music", async (req, res) => {
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

    const result = await MyMusic.find({ userId: userInfo._id });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/my-current-music", async (req, res) => {
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

    const result = await MyMusic.findOne({
      userId: userInfo._id,
      current: true,
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/my-music/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await MyMusic.find({ musicId: id });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/my-music/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(req);

    const result = await MyMusic.findOneAndUpdate({ musicId: id }, req.body);

    if (!result) {
      return res.status(404).json({ message: "Music not found" });
    }
    return res.status(200).json({ message: "Music updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
