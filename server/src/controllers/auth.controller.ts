import { RequestHandler } from "express";
import { prisma } from "../config/prisma.js";
import bcrypt from "bcrypt";

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
      message: "Server error RegisterUser",
    });
  }
};
