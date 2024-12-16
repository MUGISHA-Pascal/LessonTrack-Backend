"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthController_1 = require("../controllers/AuthController");
const AuthRoutes = (0, express_1.Router)();
AuthRoutes.post("/login", AuthController_1.login);
AuthRoutes.post("/loginForUser", AuthController_1.loginForUser);
AuthRoutes.post("/signup", AuthController_1.signup);
AuthRoutes.post("/usersignup", AuthController_1.signup_Not_admin);
AuthRoutes.post("/test", (req, res) => {
    res.status(200).json({ message: "Auth route is working!" });
});
exports.default = AuthRoutes;
