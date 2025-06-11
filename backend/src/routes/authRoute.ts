import { Router } from "express";
import {
  forgotPassword,
  login,
  logout,
  refresh,
  resetPassword,
  signUp,
  verifyEmail,
} from "../controllers/authControllers";

const authRoute = Router();

authRoute.post("/signup", signUp);
authRoute.post("/login", login);
authRoute.post("/logout", logout);
authRoute.post("/refresh", refresh);
authRoute.post("/verify-email", verifyEmail);
authRoute.post("/forgot-password", forgotPassword);
authRoute.post("/reset-password", resetPassword);

export default authRoute;
