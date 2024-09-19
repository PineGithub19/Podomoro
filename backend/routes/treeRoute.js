import express from "express";
import { Tree } from "../models/treeModel.js";
import { MyTree } from "../models/treeModel.js";
import { UserAccount } from "../models/userAccountModel.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Route for Save a new Tree
router.post("/", async (req, res) => {
  try {
    if (!req.body.name || !req.body.image || !req.body.price) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newTree = await Tree.create(req.body);
    res.status(201).json(newTree);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route for Get All Trees from database
router.get("/", async (req, res) => {
  try {
    const trees = await Tree.find({});
    res.status(200).json({
      count: trees.length,
      data: trees,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route for Save a new MyTree
router.post("/my-tree", async (req, res) => {
  try {
    if (
      !req.body.token ||
      !req.body.treeId ||
      !req.body.buy ||
      req.body.selected === undefined ||
      req.body.selected === null
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const userObj = jwt.verify(req.body.token, process.env.ACCESS_TOKEN_SECRET);

    if (!userObj) {
      return res.status(400).json({ message: "Invalid token" });
    }

    const userInfo = await UserAccount.findOne({ username: userObj.username });
    const newMyTree = await MyTree.create({
      userId: userInfo._id,
      treeId: req.body.treeId,
      buy: req.body.buy,
      selected: req.body.selected,
    });
    res.status(201).json(newMyTree);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route for Get All MyTrees
router.get("/my-tree/", async (req, res) => {
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

    const myTrees = await MyTree.find({ userId: userInfo._id });
    res.status(200).json({
      count: myTrees.length,
      data: myTrees,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route for Update myTrees by ID
router.put("/my-tree/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateFields = {};

    if (req.body.selected !== undefined) {
      updateFields.selected = req.body.selected;
    }
    if (req.body.buy !== undefined) {
      updateFields.buy = req.body.buy;
    }

    const result = await MyTree.findOneAndUpdate({ treeId: id }, updateFields);

    if (!result) {
      return res.status(404).json({ message: "Note not found" });
    }
    return res.status(200).json({ message: "Note updated successfully" });
  } catch (error) {
    console.log(error);
  }
});

// Route for Get Tree by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const tree = await Tree.findById(id);
    res.status(200).json(tree);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route for Update Tree by ID
router.put("/:id", async (req, res) => {
  try {
    if (!req.body.name || !req.body.image || !req.body.price) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const { id } = req.params;
    const result = await Tree.findByIdAndUpdate(id, req.body);

    if (!result) {
      return res.status(404).json({ message: "Tree not found" });
    }
    return res.status(200).json({ message: "Tree updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route for Delete Tree by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Tree.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ message: "Tree not found" });
    }
    return res.status(200).json({ message: "Tree deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
