"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const FeedbackRoutes = (0, express_1.Router)();
FeedbackRoutes.post("/add_comment/:userId");
FeedbackRoutes.get("/get_comments/:userId");
FeedbackRoutes.put("/update_comment/:userId");
FeedbackRoutes.delete("/delete_comment/:commentId");
exports.default = FeedbackRoutes;
