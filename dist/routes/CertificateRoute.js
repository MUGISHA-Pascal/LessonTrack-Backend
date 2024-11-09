"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const certificateRoutes = (0, express_1.Router)();
certificateRoutes.post("/add/:userId");
certificateRoutes.get("/:userId");
certificateRoutes.put("/update/:certificateId");
certificateRoutes.delete("/delete/:certificateId");
exports.default = certificateRoutes;
