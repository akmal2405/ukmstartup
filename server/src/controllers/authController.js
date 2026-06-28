import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import {
  findUserByEmail,
  insertCommunityUser,
  insertCompanyUser,
  findUserById,
  updateUserProfile,
  setVerificationToken,
  findUserByVerificationToken,
  markEmailVerified,
  setResetToken,
  findUserByResetToken,
  resetPassword,
} from "../models/userModel.js";
import { sendVerificationEmail, sendPasswordResetEmail } from "../utils/sendEmail.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

export const signup = async (req, res) => {
  try {
    const {
      email,
      password,
      userType,
      fullName,
      communityRole,
      faculty,
      matricNumber,
      yearOfStudy,
      companyName,
      industry,
      contactPerson,
      phone,
    } = req.body;

    if (!email || !password || !userType) {
      return res
        .status(400)
        .json({ message: "Please provide email, password, and user type" });
    }

    const UKM_EMAIL_REGEX = /^[\w.+-]+@(siswa\.)?ukm\.edu\.my$/i;
    if (userType === "community" && !UKM_EMAIL_REGEX.test(email)) {
      return res.status(400).json({
        message: "Please use a valid UKM email address (e.g. yourname@siswa.ukm.edu.my)",
      });
    }

    const userExists = await findUserByEmail(email);
    if (userExists.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let user;

    if (userType === "community") {
      user = await insertCommunityUser(
        email,
        hashedPassword,
        userType,
        fullName,
        communityRole,
        faculty,
        matricNumber,
        yearOfStudy,
      );
    }

    if (userType === "company") {
      user = await insertCompanyUser(
        email,
        hashedPassword,
        userType,
        companyName,
        industry,
        contactPerson,
        phone,
      );
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await setVerificationToken(user.id, verificationToken, verificationExpires);

    res.status(201).json({
      message: "Account created! Please check your email to verify your account before logging in.",
      user: {
        id: user.id,
        email: user.email,
        userType: user.userType,
      },
    });

    sendVerificationEmail(user.email, verificationToken).catch((emailError) => {
      console.error("Verification email failed:", emailError.message);
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error during signup" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }
    const users = await findUserByEmail(email);
    if (users.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = users[0];

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user.emailVerified) {
      return res.status(403).json({
        message: "Please verify your email before logging in.",
        needsVerification: true,
      });
    }

    const token = generateToken(user.id);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        userType: user.userType,
        fullName: user.fullName || user.contactPerson,
        communityRole: user.communityRole,
        companyName: user.companyName,
        industry: user.industry,
        contactPerson: user.contactPerson,
        profilePicture: user.profilePicture,
        location: user.location,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await findUserById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        userType: user.userType,
        fullName: user.fullName || user.contactPerson,
        communityRole: user.communityRole,
        companyName: user.companyName,
        industry: user.industry,
        contactPerson: user.contactPerson,
        profilePicture: user.profilePicture,
        location: user.location,
      },
    });
  } catch (error) {
    console.error("GetMe error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).json({ message: "Invalid verification link" });

    const user = await findUserByVerificationToken(token);
    if (!user) return res.status(400).json({ message: "Invalid verification link" });

    if (new Date() > new Date(user.verificationTokenExpires)) {
      return res.status(400).json({ message: "Verification link expired" });
    }

    await markEmailVerified(user.id);
    res.json({ message: "Email verified successfully. You can now log in." });
  } catch (error) {
    console.error("verifyEmail error:", error);
    res.status(500).json({ message: "Server error during email verification" });
  }
};

export const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const users = await findUserByEmail(email);
    if (users.length === 0) return res.status(404).json({ message: "No account found with that email" });

    const user = users[0];
    if (user.emailVerified) return res.status(400).json({ message: "Email already verified" });

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await setVerificationToken(user.id, verificationToken, verificationExpires);
    await sendVerificationEmail(user.email, verificationToken);

    res.json({ message: "Verification email resent. Please check your inbox." });
  } catch (error) {
    console.error("resendVerification error:", error);
    res.status(500).json({ message: "Server error resending verification email" });
  }
};

export const editProfile = async (req, res) => {
  try {
    const { fullName, email, location, companyName, industry, contactPerson } = req.body;

    const updatedUser = await updateUserProfile(
      req.user.id,
      fullName,
      email,
      req.file?.secure_url,
      location,
      companyName,
      industry,
      contactPerson,
    );

    res.json({ user: updatedUser });
  } catch (error) {
    console.error("editProfile error:", error);
    res.status(500).json({ message: "Server error updating profile" });
  }
};

export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const users = await findUserByEmail(email);
    if (users.length > 0) {
      const user = users[0];
      const token = crypto.randomBytes(32).toString("hex");
      const expires = new Date(Date.now() + 15 * 60 * 1000);
      await setResetToken(user.id, token, expires);
      try {
        await sendPasswordResetEmail(user.email, token);
      } catch (emailError) {
        console.error("Password reset email failed:", emailError.message);
      }
    }

    // Always respond the same way — prevents account enumeration
    res.json({ message: "If that email is registered, you'll receive a password reset link shortly." });
  } catch (error) {
    console.error("requestPasswordReset error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const confirmPasswordReset = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ message: "Token and new password are required" });
    }

    const user = await findUserByResetToken(token);
    if (!user) {
      return res.status(400).json({ message: "Reset link is invalid or has expired. Please request a new one." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    await resetPassword(user.id, hashedPassword);

    res.json({ message: "Password reset successfully. You can now log in with your new password." });
  } catch (error) {
    console.error("confirmPasswordReset error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
