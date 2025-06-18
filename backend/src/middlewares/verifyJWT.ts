import { NextFunction, Request, Response } from "express";
import { verifySessionToken } from "../utils/auth";

async function verifyJwt(req: Request, res: Response, next: NextFunction) {
  const { accessToken, refreshToken } = req.cookies;

  if (!accessToken) {
    if (refreshToken) {
      res.status(401).json({
        message: "Missing or expired access token",
        status: "EXPIRED_TOKEN",
      });
      return;
    } else {
      res.status(401).json({
        error: "Missing tokens, login required",
        status: "MISSING_TOKENS",
      });
    }
  }

  try {
    const decoded = verifySessionToken(accessToken);
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
    return;
  }
}

export default verifyJwt;
