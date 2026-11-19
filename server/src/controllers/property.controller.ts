import { RequestHandler } from "express";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../utils/uploadToCloudinary.js";
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
    const properties = await prisma.property.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        agent: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    res.status(200).json({
      status: true,
      message: "Get all property success!",
      data: properties,
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
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;

    if (!id) {
      res.status(400).json({
        status: false,
        message: "Invalid property id!",
      });
      return;
    }

    const property = await prisma.property.findUnique({
      where: {
        id: id,
      },
      include: {
        agent: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!property) {
      res.status(404).json({
        status: false,
        message: "ID Property not found!",
      });
      return;
    }

    res.status(200).json({
      status: true,
      message: "Get detail property success!",
      data: property,
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
    if (!req.user) {
      res.status(401).json({
        status: false,
        message: "Unauthorized Access!",
      });
      return;
    }

    const properties = await prisma.property.findMany({
      where: {
        agent_id: req.user.id,
      },
      include: {
        agent: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    res.status(200).json({
      status: true,
      message: "Get all owner property success!",
      data: properties,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Internal server error - GetAllOwnerProperty",
    });
  }
};

export const UpdatePropertyByParams: RequestHandler = async (
  req,
  res,
): Promise<void> => {
  try {
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;

    if (!id) {
      res.status(400).json({
        status: false,
        message: "Invalid property id!",
      });
      return;
    }

    if (!req.user) {
      res.status(401).json({
        status: false,
        message: "Unauthorized Access!",
      });
      return;
    }

    const property = await prisma.property.findUnique({
      where: {
        id: id,
      },
    });

    if (!property) {
      res.status(404).json({
        status: false,
        message: "ID Property not found!",
      });
      return;
    }

    if (property?.agent_id !== req.user.id) {
      res.status(403).json({
        status: false,
        message: "Forbidden Access! You are not the owner of this property!",
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

    const files = req.files as Express.Multer.File[];
    let media = property.media;

    // jika ada image baru yang di upload, maka hapus image yang lama dan ganti image baru
    if (files && files.length > 0) {
      for (const item of media) {
        try {
          await deleteFromCloudinary(item.image_id);
        } catch (error) {
          console.log(`Failed to delete image: ${item.image_id}`);
        }
      }

      //upload image baru ke cloudinary
      media = [];
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

    const updatedProperty = await prisma.property.update({
      where: {
        id: id,
      },
      data: {
        title: title ?? property.title,
        description: description ?? property.description,
        property_type: property_type ?? property.property_type,
        listing_type: listing_type ?? property.listing_type,
        price: price !== undefined ? Number(price) : property.price,
        status: status ?? property.status,

        specs: {
          bedrooms:
            bedrooms !== undefined ? Number(bedrooms) : property.specs.bedrooms,
          bathrooms:
            bathrooms !== undefined
              ? Number(bathrooms)
              : property.specs.bathrooms,
          surface_area:
            surface_area !== undefined
              ? Number(surface_area)
              : property.specs.surface_area,
          building_area:
            building_area !== undefined
              ? Number(building_area)
              : property.specs.building_area,
          floors: floors !== undefined ? Number(floors) : property.specs.floors,
        },

        location: {
          address: address ?? property.location.address,
          city: city ?? property.location.city,
          state: state ?? property.location.state,
          coordinates: [
            longitude !== undefined
              ? Number(longitude)
              : property.location.coordinates[0],
            latitude !== undefined
              ? Number(latitude)
              : property.location.coordinates[1],
          ],
        },

        amenities: parseAmenities ?? property.amenities,
        media: media,
      },
    });

    res.status(201).json({
      status: true,
      message: "Update property success!",
      data: updatedProperty,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Internal server error - UpdatePropertyByParams",
    });
  }
};

export const DeleteProperty: RequestHandler = async (
  req,
  res,
): Promise<void> => {
  try {
    res.status(200).json({
      status: true,
      message: "Delete property success!",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Internal server error - DeleteProperty",
    });
  }
};
