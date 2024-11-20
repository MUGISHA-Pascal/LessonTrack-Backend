"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const CommentController_1 = require("../controllers/CommentController");
const CommentRoutes = (0, express_1.Router)();
CommentRoutes.post("/add/:userId", CommentController_1.commentAdding);
CommentRoutes.get("/:userId", CommentController_1.getComments);
CommentRoutes.put("/update/:userId", CommentController_1.commentUpdate);
CommentRoutes.delete("/delete/:commentId", CommentController_1.commentDelete);
exports.default = CommentRoutes;
