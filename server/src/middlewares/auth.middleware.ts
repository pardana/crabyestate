import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma.js";

interface UserProfile {
  id: any;
  name: string;
  email: string;
  phone?: string;
}

// Awalnya Express cuma tahu req punya data bawaan seperti req.body, req.params, dan req.headers.
// Kode ini mengajari TypeScript bahwa kita menambahkan kotak baru: req.user
// Jadi bisa lihat console.log(req.user.name);
declare global {
  namespace Express {
    interface Request {
      user: UserProfile;
    }
  }
}

const AuthMiddleware: RequestHandler = async (req, res, next) => {
  try {
    const authToken = req.headers.authorization;
    if (!authToken) {
      res.status(401).json({
        success: false,
        message: "Unauthorized Access!",
      });
      return;
    }

    // Bearer index 0
    // jdakjdgajsdgiuagdasgdadajdgajks index 1
    const token = authToken.split("Bearer ")[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };

    const currentUser = await prisma.user.findUnique({
      where: {
        id: payload.id,
      },
    });

    if (!currentUser) {
      res.status(401).json({
        success: false,
        message: "Unauthorized Access!",
      });
      return;
    }

    req.user = {
      id: currentUser.id,
      name: currentUser.name,
      email: currentUser.email,
      phone: currentUser.phone || null || undefined,
    };

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Unauthorized Access!",
    });
  }
};

export default AuthMiddleware;
