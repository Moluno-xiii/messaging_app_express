import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import prisma from "../prisma";
import { sendVerificationEmail } from "../config/emailService";

interface UserData {
  hashedPassword: string;
  email: string;
  id: string;
}

interface SessionTokenData {
  email: string;
  id: string;
  sessionId: string;
  iat: number;
  exp: number;
}

interface TokenData {
  iat: number;
  exp: number;
  hashedPassword: string;
  email: string;
}

const verifySessionToken = (token: string) => {
  try {
    const data = jwt.verify(token, process.env.TOKEN_SECRET as string);
    return data as SessionTokenData;
  } catch (err) {
    return null;
  }
};

const findUserData = async (email: string): Promise<UserData> => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      throw new Error(
        "Incorrect credentials. \n Note : Both fields are case sensitive"
      );
    }
    return user;
  } catch (err) {
    throw new Error(
      err instanceof Error ? err.message : "Unexpected error occured"
    );
  }
};

const generateTokens = (email: string, id: string, sessionId: string) => {
  const accessToken = jwt.sign(
    {
      email,
      id,
      sessionId,
    },
    process.env.TOKEN_SECRET as string,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    {
      email,
      id,
      sessionId,
    },
    process.env.TOKEN_SECRET as string,
    { expiresIn: "15d" }
  );

  return { accessToken, refreshToken };
};

const setCookies = (
  res: Response,
  accessToken: string,
  refreshToken: string
) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    maxAge: 15 * 24 * 60 * 60 * 1000,
  });
};

const createTemporaryUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const doesUserEmailExist = await checkIfUserExists(email);

    if (doesUserEmailExist > 0) {
      res.status(409).json({
        message: "Email already exists!",
        success: false,
      });
      return;
    }

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
    await sendVerificationEmail(email, token);
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

const checkIfUserExists = async (email: string) => {
  try {
    const doesUserEmailExist = await prisma.user.count({
      where: {
        email,
      },
    });

    return doesUserEmailExist;
  } catch (error) {
    return -1;
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

const verifyToken = (token: string, res: Response) => {
  try {
    const decryptedData = jwt.verify(token, process.env.TOKEN_SECRET as string);
    return decryptedData as TokenData;
  } catch (err) {
    return null;
  }
};
export {
  createTemporaryUser,
  findUserData,
  generateTokens,
  setCookies,
  verifySessionToken,
  verifyToken,
  checkIfUserExists,
};
