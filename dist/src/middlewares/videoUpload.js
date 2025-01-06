"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const videoUpload = (0, multer_1.default)({
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
exports.default = videoUpload;
