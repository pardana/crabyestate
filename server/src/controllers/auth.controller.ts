import { RequestHandler } from "express";
import { prisma } from "../config/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const RegisterUser: RequestHandler = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password || !phone) {
      res.status(400).json({
        success: false,
        message: "Name, email, password, and phone are required!",
      });
      return;
    }

    if (password.length <= 6) {
      res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters!",
      });
      return;
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      res.status(409).json({
        success: false,
        message: "Email already registered!",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
        phone: phone,
      },
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully!",
      data: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error - RegisterUser",
    });
  }
};

export const LoginUser: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Email and password is required!",
      });
      return;
    }

    const userDoc = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!userDoc) {
      res.status(400).json({
        success: false,
        message: "Email not found!",
      });
      return;
    }

    const passwordMatch = await bcrypt.compare(password, userDoc.password);
    if (!passwordMatch) {
      res.status(400).json({
        success: false,
        message: "Password not match!",
      });
      return;
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT_SECRET is not defined");
    }

    const token = jwt.sign(
      {
        id: userDoc.id,
        email: userDoc.email,
      },
      jwtSecret,
      {
        expiresIn: "1d",
      },
    );

    res.status(200).json({
      status: true,
      message: "Login user success!",
      token: token,
      data: {
        id: userDoc.id,
        name: userDoc.name,
        email: userDoc.email,
        phone: userDoc.phone,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Internal server error - LoginUser",
    });
  }
};
