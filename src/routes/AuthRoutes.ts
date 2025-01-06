import { Router } from "express";
import {
  emailVerification,
  login,
  loginForUser,
  signup,
  signup_Not_admin,
  WebLoginController,
  webSignup,
} from "../controllers/AuthController";

const AuthRoutes = Router();
AuthRoutes.post("/login", login);
AuthRoutes.post("/loginForUser", loginForUser);
AuthRoutes.post("/signup", signup);
AuthRoutes.post("/usersignup", signup_Not_admin);
AuthRoutes.post("/web_login", WebLoginController);
AuthRoutes.post("/web_signup", webSignup);
AuthRoutes.get("/verify_email/:token", emailVerification);
AuthRoutes.post("/test", (req, res) => {
  res.status(200).json({ message: "Auth route is working!" });
});
export default AuthRoutes;
