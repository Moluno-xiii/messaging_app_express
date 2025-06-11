import { Router, Request, Response, NextFunction } from "express";
import { login, logout, signUp, refresh } from "../utils/auth";
import prisma from "../prisma";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { TIME_SERIES_DUPLICATE_POLICIES } from "redis";
import { hash } from "crypto";
import { resetPasswordEmail, verifyEmail } from "../config/emailService";

const authRoute = Router();

authRoute.post("/signup", signUp);
authRoute.post("/login", login);
authRoute.post("/logout", logout);
authRoute.post("/refresh", refresh);
authRoute.post(
  "/verify-email",
  async (req: Request, res: Response, next: NextFunction) => {
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
      res.status(200).json({
        message: "Email verified successfully.",
        success: true,
        data: req.body,
        decodedData: decryptedData,
        newUser,
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
  }
);
authRoute.post(
  "/forgot-password",
  async (req: Request, res: Response, next: NextFunction) => {
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
      await resetPasswordEmail(req.body.email, encryptedEmailToken);
      res.status(200).json({
        message: "Email reset instructions sent to your email.",
        success: true,
      });
    } catch (error: unknown) {
      console.error("Error occured while forgot password.", error);
      res.status(500).json({
        message: "Unexpected error occured, try again",
        success: false,
      });
    }
  }
);
authRoute.post(
  "/reset-password",
  async (req: Request, res: Response, next: NextFunction) => {
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
      console.error("error message for reset password :", error);
      res
        .status(500)
        .json({ message: "Unknown error on reset password", success: false });
    }
  }
);

authRoute.post(
  "/test-signup",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await createTemporaryUser(req, res, next);
      console.log("i ran");
    } catch (error: unknown) {
      console.error("error occured : ", error);
      res
        .status(500)
        .json({
          message: "Extremely unexpected eror, try again",
          success: false,
        });
    }
  }
);

export default authRoute;

const createTemporaryUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await checkIfUserExists(res, req);

    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const token = generateTemporaryToken(email, hashedPassword);
    const temporaryUser = await prisma.temporaryUser.upsert({
      where: { email },
      update: {
        hashedPassword,
      },
      create: {
        email,
        hashedPassword,
      },
    });
    console.log("temporary created user :  ", temporaryUser);
    await verifyEmail(email, token);
    return res.status(200).json({
      message: "Check your email to verify your email.",
      success: true,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "unexpected error", success: false, error });
  }
};

const checkIfUserExists = async (res: Response, req: Request) => {
  try {
    const doesUserEmailExist = await prisma.user.count({
      where: {
        email: req.body.email ?? "",
      },
    });

    if (doesUserEmailExist > 0) {
      return res.status(409).json({
        message: "Email already exists!",
        success: false,
      });
    }
    return;
  } catch (error) {
    res.status(500).json({ message: "Unexpected error", success: false });
  }
};

const generateTemporaryToken = (email: string, hashedPassword: string) => {
  const token = jwt.sign(
    {
      email,
      hashedPassword,
    },
    process.env.TOKEN_SECRET as string,
    { expiresIn: "45m" }
  );

  return token;
};

interface TokenData {
  iat: number;
  exp: number;
  hashedPassword: string;
  email: string;
}

const verifyToken = (token: string, res: Response) => {
  try {
    const decryptedData = jwt.verify(token, process.env.TOKEN_SECRET as string);
    console.log("decrypted token data ", decryptedData);
    return decryptedData as TokenData;
  } catch (err) {
    return null;
  }
};
export { checkIfUserExists, createTemporaryUser };
