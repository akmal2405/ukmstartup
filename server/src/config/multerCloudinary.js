import multer from "multer";
import CloudinaryStorage from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary: { v2: cloudinary },
  params: {
    folder: "profile_pictures",
  },
});

export default multer({ storage });
