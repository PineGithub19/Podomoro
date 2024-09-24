import dotenv from "dotenv";
import express from "express";
import { UserAccount } from "../models/userAccountModel.js";
import { UserVerificationAccount } from "../models/userVerificationModel.js";
import { UserForgotPassword } from "../models/userForgotPassword.js";

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import { v4 as uuidv4 } from "uuid";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";

// import { verify } from "crypto";

dotenv.config();
const router = express.Router();
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(express.static(path.join(__dirname, "views")));

// nodemail stuff
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASS,
  },
});

// transporter.verify((error, success) => {
//   if (error) {
//     console.log(error);
//   } else {
//     console.log(success);
//   }
// });

// send verification email
const sendVerificationEmail = async ({ _id, email }, res) => {
  const currentUrl = process.env.CURRENT_URL;
  const uniqueString = uuidv4() + _id;
  const mailOptions = {
    from: process.env.AUTH_EMAIL,
    to: email,
    subject: "Verify your email on Podomoro25",
    html: `
      <p>Verify your email address to complete the signup and login into your account.</p>
      <p>This link expires in 6 hours. Press</p>
      <a href=${
        currentUrl + "auth/user/verify/" + _id + "/" + uniqueString
      }>link here</a>
      <p>to proceed.</p>
    `,
  };

  const hasedUniqueString = await bcrypt.hash(uniqueString, 10);
  const newVerification = await UserVerificationAccount.create({
    userId: _id,
    uniqueString: hasedUniqueString,
    createdAt: Date.now(),
    exprisesAt: Date.now() + 21600000,
  });

  if (!newVerification) {
    res.status(500).json({ message: "Can't verify" });
  } else {
    transporter.sendMail(mailOptions);
  }
};

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
      verified: false,
    });

    // handle account verification
    sendVerificationEmail({ _id: user._id, email: user.email }, res);

    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// verify email
router.get("/user/verify/:userId/:uniqueString", async (req, res) => {
  let { userId, uniqueString } = req.params;

  const verification = await UserVerificationAccount.findOne({
    userId: userId,
  });

  if (verification) {
    const hashedUniqueString = verification.uniqueString;
    const expiresAt = verification.exprisesAt;

    if (expiresAt < Date.now()) {
      await UserVerificationAccount.deleteOne({ userId: userId });
      res.status(500).json({ message: "Verification has expired" });
    } else {
      if (await bcrypt.compare(uniqueString, hashedUniqueString)) {
        const isUpdatedUSer = await UserAccount.findOneAndUpdate(
          { _id: userId },
          { verified: true }
        );

        if (isUpdatedUSer) {
          const isUpdatedVerification = await UserVerificationAccount.deleteOne(
            { userId }
          );

          if (isUpdatedVerification) {
            res.sendFile(path.join(__dirname, "../views/verification.html"));
          }
        }
      }
    }
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

  if (!checkUser.verified) {
    res
      .status(500)
      .json({ message: "Email hasn't been verified yet. Check your inbox." });
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
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "12h" });
}

// Password Reset
router.post("/forgot-password", async (req, res) => {
  const { username, email } = req.body;

  const user = await UserAccount.findOne({ username: username, email: email });

  if (user) {
    if (!user.verified) {
      res
        .status(500)
        .json({ message: "Email hasn't been verified yet. Check your inbox." });
    } else {
      sendRessetEmail(user, res);
      res.status(200).json({ message: "Check your email inbox." });
    }
  } else {
    res
      .status(500)
      .json({ message: "No account with the supplied email exists!" });
  }
});

const sendRessetEmail = async ({ _id, email }, res) => {
  const currentFeUrl = process.env.CURRENT_FE_URL;
  const resetString = uuidv4() + _id;

  try {
    const resetPassword = await UserForgotPassword.deleteMany({ userId: _id });

    if (resetPassword) {
      const mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: email,
        subject: "Password Reset on Podomoro25",
        html: `
          <p>We heard you lost the password.</p>
          <p> Don't worry, use the link below to reset it.</p>
          <p>This link expires in 60 minutes. Press</p>
          <a href=${
            currentFeUrl +
            "auth/user/forgot-password/" +
            _id +
            "/" +
            resetString
          }>link here</a>
          <p>to proceed.</p>
        `,
      };

      const hashedResetString = await bcrypt.hash(resetString, 10);

      if (hashedResetString) {
        const newPasswordReset = await UserForgotPassword.create({
          userId: _id,
          resetString: hashedResetString,
          createdAt: Date.now(),
          expiresAt: Date.now() + 3600000,
        });

        if (newPasswordReset) {
          transporter.sendMail(mailOptions);
        }
      }
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

router.post("/reset-password", async (req, res) => {
  let { userId, resetString, newPassword } = req.body;

  try {
    const passwordReset = await UserForgotPassword.findOne({ userId: userId });
    const hasedResetString = passwordReset.resetString;

    if (passwordReset) {
      const { expiresAt } = passwordReset.expiresAt;

      if (expiresAt < Date.now()) {
        await UserForgotPassword.deleteOne({ userId: userId });
      } else {
        if (await bcrypt.compare(resetString, hasedResetString)) {
          const hasedNewpassword = await bcrypt.hash(newPassword, 10);

          if (hasedNewpassword) {
            await UserAccount.updateOne(
              { _id: userId },
              { password: hasedNewpassword }
            );

            await UserForgotPassword.deleteOne({ userId: userId });

            res.status(200).json({ message: "Change password successfully." });
          }
        }
      }
    } else {
      res.status(500).json({ message: "Password reset request not found." });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
