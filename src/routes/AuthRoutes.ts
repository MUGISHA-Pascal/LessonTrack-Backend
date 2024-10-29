import { Router } from "express";

const AuthRoutes = Router();

AuthRoutes.post("/login");
AuthRoutes.post("/signup");

export default AuthRoutes;
