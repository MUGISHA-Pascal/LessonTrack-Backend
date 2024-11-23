"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthController_1 = require("../controllers/AuthController");
const AuthRoutes = (0, express_1.Router)();
AuthRoutes.post("/login", AuthController_1.login);
AuthRoutes.post("/signup", AuthController_1.signup);
exports.default = AuthRoutes;
