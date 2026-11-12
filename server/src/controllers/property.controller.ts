import { RequestHandler } from "express";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";
import { prisma } from "../config/prisma.js";

export const CreateProperty: RequestHandler = async (
  req,
  res,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        status: false,
        message: "Unauthorized Access!",
      });
      return;
    }

    const {
      title,
      description,
      property_type,
      listing_type,
      price,
      status,
      bedrooms,
      bathrooms,
      surface_area,
      building_area,
      floors,
      address,
      city,
      state,
      longitude,
      latitude,
      amenities,
    } = req.body;

    if (
      !title ||
      !description ||
      !property_type ||
      !listing_type ||
      !price === undefined
    ) {
      res.status(400).json({
        status: false,
        message:
          "Title, description, property type, listing type, and price are required!",
      });
      return;
    }

    const files = req.files as Express.Multer.File[];
    const media = [];

    if (files && files.length > 0) {
      for (let index = 0; index < files.length; index++) {
        const result = await uploadToCloudinary(
          files[index].buffer,
          "crabyestate/property",
        );

        media.push({
          url: result.url,
          image_id: result.image_id,
        });
      }
    }

    const parseAmenities =
      typeof amenities === "string" ? JSON.parse(amenities) : amenities || [];

    const property = await prisma.property.create({
      data: {
        title: title,
        description: description,
        property_type: property_type,
        listing_type: listing_type,
        price: Number(price),
        status: status || "PENDING",

        specs: {
          bedrooms: Number(bedrooms || 0),
          bathrooms: Number(bathrooms || 0),
          surface_area: Number(surface_area || 0),
          building_area: Number(building_area || 0),
          floors: Number(floors || 1),
        },

        location: {
          address: address || "",
          city: city || "",
          state: state || "",
          coordinates: [Number(longitude || 0), Number(latitude || 0)],
        },

        amenities: parseAmenities,
        media,
        agent_id: req.user.id,
      },
    });

    res.status(201).json({
      status: true,
      message: "Create property success!",
      data: property,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Internal server error - CreateProperty",
    });
  }
};

export const ReadAllProperty: RequestHandler = async (
  req,
  res,
): Promise<void> => {
  try {
    res.status(200).json({
      status: true,
      message: "Read all property success!",
      data: await prisma.property.findMany(),
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Internal server error - ReadAllProperty",
    });
  }
};

export const DetailProperty: RequestHandler = async (
  req,
  res,
): Promise<void> => {
  try {
    const { id } = req.params;
    res.status(200).json({
      status: true,
      message: "Detail property success!",
      data: id,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Internal server error - DetailProperty",
    });
  }
};

export const GetAllOwnerProperty: RequestHandler = async (
  req,
  res,
): Promise<void> => {
  try {
    res.status(200).json({
      status: true,
      message: "Get all owner property success!",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Internal server error - GetAllOwnerProperty",
    });
  }
};
