"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const questionRoutes = (0, express_1.Router)();
questionRoutes.post("/add/:userId");
questionRoutes.get("/");
questionRoutes.put("/update/:userId");
questionRoutes.delete("/delete/:questionId");
exports.default = questionRoutes;
