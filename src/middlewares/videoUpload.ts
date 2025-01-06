import { NextFunction, Response } from "express";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const videoUpload = multer({
  storage,
  //   fileFilter: (req, file, cb) => {
  //     const ext = path.extname(file.originalname);
  //     if (ext !== ".mp4" && ext !== ".mov" && ext !== ".avi") {
  //       return cb(new Error("Only video files are allowed"), false);
  //     } else {
  //       cb(null, true);
  //     }
  //   },
});

export default videoUpload;
