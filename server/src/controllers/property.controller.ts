import { RequestHandler } from "express";

export const CreateProperty: RequestHandler = async (
  req,
  res,
): Promise<void> => {
  try {
    res.status(201).json({
      status: true,
      message: "Create property success!",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Internal server error - CreateProperty",
    });
  }
};
