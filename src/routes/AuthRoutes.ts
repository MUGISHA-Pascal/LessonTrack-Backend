import { Router } from "express";
import { login, signup } from "../controllers/AuthController";

const AuthRoutes = Router();

AuthRoutes.post("/login", login);
AuthRoutes.post("/signup", signup);

export default AuthRoutes;
