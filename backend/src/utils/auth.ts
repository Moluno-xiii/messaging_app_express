import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { redisClient } from "../config/redis";
import prisma from "../prisma";

interface UserData {
  hashed_password: string;
  email: string;
  id: string;
}

interface TokenData {
  email: string;
  id: string;
  sessionId: string;
  iat: number;
  exp: number;
}

const signUp = async (req: Request, res: Response, next: NextFunction) => {
  const hashed_password = await bcrypt.hash(req.body.password, 10);

  try {
    await prisma.user.create({
      data: {
        email: req.body.email,
        hashed_password,
      },
    });
    res.status(200).json({
      message: "SignUp successful",
    });
  } catch (err: unknown) {
    if (
      (err as any).code === "P2002" &&
      (err as any).meta?.target?.includes("email")
    ) {
      console.error(err);
      res.status(409).json({ error: "Email already exists!" });
      return;
    }
    console.error(err);
    res.status(500).json({ error: "Unexpected error, try again." });
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email || !password) {
    console.log("request body : ", req.body);
    res.status(400).json({ error: "Missing credentials" });
    return;
  }

  try {
    const user = await findUserData(req.body.email);
    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.hashed_password
    );

    if (!isPasswordCorrect) {
      res.status(401).json({
        error:
          "Incorrect credentials. \n Note : both fields are case sensitive",
      });
      return;
    }

    const sessionId = crypto.randomUUID();
    const { accessToken, refreshToken } = generateTokens(
      email,
      user.id,
      sessionId
    );
    console.log("stored refresh token : ", refreshToken);

    await redisClient.setEx(
      `session:${sessionId}`,
      15 * 24 * 60 * 60,
      refreshToken
    );
    setCookies(res, accessToken, refreshToken);

    res.status(200).json({ message: "Login successful!", user });
  } catch (err) {
    const error = err instanceof Error ? err.message : "Unexpected error";
    res.status(500).json({ error });
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

    // check if token is valid
    const decoded = verifyToken(refreshToken, res);
    if (!decoded) {
      res.status(401).json("Invalid refresh token");
      return;
    }
    // if token is valid, but doesn't match the stored token with the decoded token's session id
    const { sessionId, email, id } = decoded;
    const storedToken = await redisClient.get(`session:${sessionId}`);

    if (refreshToken !== storedToken) {
      console.log("old refresh token,:", refreshToken);
      console.log("stored refresh token : ", storedToken);
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

const verifyToken = (token: string, res: Response) => {
  try {
    const data = jwt.verify(token, process.env.TOKEN_SECRET as string);
    return data as TokenData;
  } catch (err) {
    console.error(err);
    return null;
  }
};

const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await redisClient.del(`session:${req.body.sessionId}`);
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(200).json({ message: "Logout successful!" });
  } catch (err: unknown) {
    res.status(500).json({ error: "An unexpected error occured, try again." });
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
    throw new Error("Something went wrong, try again.");
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

export { login, logout, refresh, signUp, verifyToken };
