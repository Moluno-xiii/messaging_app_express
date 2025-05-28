import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/auth";

async function verifyJwt(req: Request, res: Response, next: NextFunction) {
  const { accessToken, refreshToken } = req.cookies;
  console.log("cookies", req.cookies);

  if (!accessToken) {
    if (refreshToken) {
      res.status(401).json({
        message: "Missing or expired access token",
        status: "EXPIRED_TOKEN",
      });
      return;
    }

    res.status(401).json({
      error: "Missing tokens, login required",
      status: "MISSING_TOKENS",
    });
  }

  try {
    const decoded = verifyToken(accessToken, res);
    console.log("decoded user :", decoded);

    if (!decoded) {
      res
        .status(401)
        .json({ error: "Invalid access token", status: "INVALID_TOKEN" });
      return;
    }
    req.user = decoded;
    next();
  } catch (err) {
    res.status(500).json({ error: "unexpected error" });
  }
}

export default verifyJwt;
