import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { redisClient } from "../config/redis";
import prisma from "../prisma";
import {
  createTemporaryUser,
  findUserData,
  generateTokens,
  setCookies,
  verifySessionToken,
  verifyToken,
} from "../utils/auth";
import { sendResetPasswordEmail } from "../config/emailService";

const signUp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await createTemporaryUser(req, res, next);
  } catch (error: unknown) {
    res.status(500).json({
      message: "Extremely unexpected eror, try again",
      success: false,
    });
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: "Missing credentials" });
    return;
  }

  try {
    const user = await findUserData(req.body.email);
    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.hashedPassword
    );

    if (!isPasswordCorrect) {
      res.status(401).json({
        error:
          "Incorrect credentials. \n Note : both fields are case sensitive",
      });
      return;
    }

    const userProfile = await prisma.profile.findUnique({
      where: {
        email: user.email,
      },
    });

    const sessionId = crypto.randomUUID();
    const { accessToken, refreshToken } = generateTokens(
      email,
      user.id,
      sessionId
    );

    await redisClient.setEx(
      `session:${sessionId}`,
      15 * 24 * 60 * 60,
      refreshToken
    );

    setCookies(res, accessToken, refreshToken);
    res.status(200).json({ message: "Login successful!", user: userProfile });
  } catch (err) {
    const error = err instanceof Error ? err.message : "Unexpected error";
    res.status(500).json({ error });
  }
};

const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  const decryptedData = verifyToken(req.body.token, res);

  if (!decryptedData) {
    res
      .status(401)
      .json({ message: "Token invalid or expired", success: false });
    return;
  }

  try {
    const newUser = await prisma.user.create({
      data: {
        email: decryptedData.email,
        hashedPassword: decryptedData.hashedPassword,
      },
    });
    await prisma.temporaryUser.delete({
      where: {
        email: decryptedData.email,
      },
    });
    await prisma.profile.create({
      data: {
        id: newUser.id,
        email: newUser.email,
        displayName: newUser.email,
      },
    });

    res.status(200).json({
      message: "Email verified successfully.",
      success: true,
    });
    return;
  } catch (err: unknown) {
    if (
      (err as any).code === "P2002" &&
      (err as any).meta?.target?.includes("email")
    ) {
      res
        .status(409)
        .json({ success: false, message: "Email already exists!" });
      return;
    }
    res
      .status(500)
      .json({ success: false, message: "Unexpected error, try again." });
  }
};

const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { accessToken } = req.cookies;
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    const tokenData = verifySessionToken(accessToken, res);

    if (!tokenData) {
      res.status(400).json({ message: "Invalid token", success: false });
      return;
    }
    await redisClient.del(`session:${tokenData?.sessionId}`);
    res.status(200).json({ message: "Logout successful!", success: true });
  } catch (err: unknown) {
    res.status(500).json({
      message: "An unexpected error occured, try again.",
      success: false,
    });
  }
};

const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const doesUserExist = await prisma.user.count({
      where: {
        email: req.body.email,
      },
    });
    if (doesUserExist < 1) {
      res.status(404).json({
        message: "User doesn't exist, check your input and try again.",
        success: false,
        doesUserExist,
      });
      return;
    }
    const encryptedEmailToken = jwt.sign(
      {
        email: req.body.email,
      },
      process.env.TOKEN_SECRET as string,
      { expiresIn: "15m" }
    );
    await sendResetPasswordEmail(req.body.email, encryptedEmailToken);
    res.status(200).json({
      message: "Email reset instructions sent to your email.",
      success: true,
    });
  } catch (error: unknown) {
    res.status(500).json({
      message: "Unexpected error occured, try again",
      success: false,
    });
  }
};

const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { token, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const decryptedData = verifyToken(token, res);
  if (!decryptedData) {
    res
      .status(400)
      .json({ message: "Invalid or expired token", success: false });
    return;
  }
  try {
    await prisma.user.update({
      where: {
        email: decryptedData.email,
      },
      data: {
        hashedPassword,
      },
    });
    res
      .status(200)
      .json({ message: "Password reset successfully", success: true });
  } catch (error: unknown) {
    res
      .status(500)
      .json({ message: "Unknown error on reset password", success: false });
  }
};

const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      res
        .status(401)
        .json({ error: "No refresh token, refresh token required." });
      return;
    }

    const decoded = verifySessionToken(refreshToken, res);
    if (!decoded) {
      res.status(401).json("Invalid refresh token");
      return;
    }
    const { sessionId, email, id } = decoded;
    const storedToken = await redisClient.get(`session:${sessionId}`);

    if (refreshToken !== storedToken) {
      res.status(401).json({ error: "Invalid refresh token, log user out" });
      return;
    }

    if (!storedToken) {
      res.status(401).json({ error: "Invalid token" });
      return;
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(
      email,
      id,
      sessionId
    );

    await redisClient.del(`session:${sessionId}`);
    await redisClient.setEx(
      `session:${sessionId}`,
      15 * 24 * 60 * 60,
      newRefreshToken
    );

    setCookies(res, accessToken, newRefreshToken);
    res.json({ message: "Cookies refreshed successfully!" });
    return;
  } catch (err) {
    res.status(500).json({ error: "An unexpected error occured" });
  }
};

export {
  login,
  logout,
  refresh,
  signUp,
  verifyEmail,
  forgotPassword,
  resetPassword,
};
