"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const certificateRoutes = (0, express_1.Router)();
certificateRoutes.post("/add_certificate/:userId");
certificateRoutes.get("/get_certificate");
certificateRoutes.put("/update_certificate/:userId");
certificateRoutes.delete("/delete_certificate/:certificateId");
exports.default = certificateRoutes;
