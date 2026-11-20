import { RequestHandler } from "express";
import { prisma } from "../config/prisma.js";

export const SendContactMessage: RequestHandler = async (
  req,
  res,
): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        status: false,
        message: "Unauthorized access!",
      });
      return;
    }

    const { property_id, message, firstName, lastName, email, phone } =
      req.body;

    if (
      !property_id ||
      !message ||
      !firstName ||
      !lastName ||
      !email ||
      !phone
    ) {
      res.status(400).json({
        status: false,
        message: "Missing required fields!",
      });
      return;
    }

    // cek jika userId tidak ditemukan di database
    const sender = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!sender) {
      res.status(404).json({
        status: false,
        message: "Sender/user not found!",
      });
      return;
    }

    // cek jika property_id tidak ditemukan di database
    const property = await prisma.property.findUnique({
      where: {
        id: property_id,
      },
      include: {
        agent: true,
      },
    });

    if (!property) {
      res.status(404).json({
        status: false,
        message: "Property not found!",
      });
      return;
    }

    // cek jika userId sama dengan agent_id dari property nya sendiri
    if (property.agent_id === userId) {
      res.status(400).json({
        status: false,
        message: "You cannot send a message to your own property!",
      });
      return;
    }

    const contact = await prisma.contactMessage.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        message,
        sender_id: sender.id,
        agent_id: property.agent_id,
        property_id: property.id,
      },
    });

    res.status(201).json({
      status: true,
      message: "Send message successfully!",
      data: contact,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Internal server error - SendContactMessage",
    });
  }
};
