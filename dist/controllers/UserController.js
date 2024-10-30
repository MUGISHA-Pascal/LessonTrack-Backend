"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileUploadController = void 0;
const User_1 = __importDefault(require("../models/User"));
const profileUploadController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const userId = id;
        const user = yield User_1.default.findOne({ where: { id: userId } });
        if (user) {
            if (req.file) {
                user.profilePicture = req.file.path;
                res.json({ message: "user image uploaded successfully", user });
            }
            else {
                res.status(400).json({ message: "no image file uploaded" });
            }
        }
        else {
            res.status(404).json({ message: "user not found" });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "server error" });
    }
});
exports.profileUploadController = profileUploadController;
