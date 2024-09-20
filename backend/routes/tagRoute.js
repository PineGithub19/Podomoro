import express from "express";
import { Tag } from "../models/tagModel.js";
import { UserAccount } from "../models/userAccountModel.js";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/create", async (req, res) => {
  try {
    if (
      !req.body.name ||
      !req.body.color ||
      req.body.current === undefined ||
      req.body.current === null
    ) {
      return res.status(500).json({ message: "All fieldsare required" });
    }

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

    const userInfo = await UserAccount.findOne({
      username: userObj.username,
    });

    const tag = await Tag.create({
      name: req.body.name,
      color: req.body.color,
      current: req.body.current,
      userId: userInfo._id,
    });
    res.status(201).json(tag);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// used for create 4 basic tags for newbie
router.post("/create-newbie", async (req, res) => {
  try {
    if (
      !req.body.name ||
      !req.body.color ||
      req.body.current === undefined ||
      req.body.current === null
    ) {
      return res.status(500).json({ message: "All fieldsare required" });
    }

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

    const userInfo = await UserAccount.findOne({
      username: userObj.username,
    });

    const newbieTags = ["Study", "Rest", "Entertainment", "Other"];
    const hasCurrentTag = await Tag.findOne({
      userId: userInfo._id,
      name: req.body.name,
    });

    if (hasCurrentTag) {
      return res.status(500).json({ message: "User already has this tag" });
    }

    if (!newbieTags.find((item) => item === req.body.name)) {
      return res.status(500).json({ message: "Error tags for newbie" });
    }

    const tag = await Tag.create({
      name: req.body.name,
      color: req.body.color,
      current: req.body.current,
      userId: userInfo._id,
    });
    res.status(201).json(tag);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// router.get("/get-common-tags", async (req, res) => {
//   try {
//     const authHeader = req.headers["authorization"];
//     const token = authHeader && authHeader.split(" ")[1];

//     if (!token) {
//       return res
//         .status(400)
//         .json({ message: "Authorization token are required" });
//     }

//     const userObj = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

//     if (!userObj) {
//       return res.status(401).json({ message: "Invalid token" });
//     }

//     const userInfo = await UserAccount.findOne({
//       username: userObj.username,
//     });

//     const tags = await Tag.find({
//       userId: userInfo._id,
//     });
//     res.status(200).json(tags);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// Router for getting tag of a specific user
router.get("/get-tags", async (req, res) => {
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
        $or: [{ userId: userInfo._id }],
      });

      res.status(200).json(tags);
    } else if (tagName === "") {
      const tags = await Tag.find({
        $or: [{ userId: userInfo._id }],
      });
      res.status(200).json(tags);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Router for changing the current tag
router.put("/edit/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await Tag.findByIdAndUpdate(id, {
      current: req.body.current,
    });

    if (!result) {
      return res.status(404).json({ message: "Tag not found" });
    }
    return res.status(200).json({ message: "Tag updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Router for getting the current Tag
router.get("/current-tag", async (req, res) => {
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

    const result = await Tag.findOne({ userId: userInfo._id, current: true });
    // const result2 = await Tag.findOne({
    //   userId: "66d9718aabf31ce12df4cb46",
    // current: true,
    // });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
