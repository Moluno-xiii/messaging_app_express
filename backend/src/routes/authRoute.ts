import { Router, Request, Response, NextFunction } from "express";
import { login, logout, signUp, refresh } from "../utils/auth";

const authRoute = Router();

authRoute.post("/signup", signUp);
authRoute.post("/login", login);
authRoute.post("/logout", logout);
authRoute.post("/refresh", refresh);

export default authRoute;
