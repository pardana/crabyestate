import multer from "multer";
import path from "path";

//penyimpanan sementara
const storage = multer.memoryStorage();

const fileFilter = (req: any, file: any, cb: any) => {
  const ext = path.extname(file.originalname).toLocaleLowerCase();

  if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
    return cb(new Error("Image must be .jpg, .jpeg, or .png"), false);
  }

  cb(null, true);
};

const uploadFileMulter = multer({ storage, fileFilter });
export default uploadFileMulter;
