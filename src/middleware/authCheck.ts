import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config/index.js";
import { StatusCode } from "../interface/StatusCode.js";
import { NextFunction, Request, Response } from "express";

const refreshKeyToken = config.jwt_refresh_key;
const accessKeyToken = config.jwt_access_key;

export const authCheck = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const accessToken = req.headers["authorization"]?.split(" ")[1];

    if (!accessToken) {
      res.status(StatusCode.Unauthorized).json({ message: "Access token missing" });
      return;
    }

    try {
      const decoded = jwt.verify(accessToken, accessKeyToken) as JwtPayload;
      req.user = decoded; 
      next(); 
    } catch (error: any) {
      if (error.name === "TokenExpiredError") {
        const { refreshToken } = req.cookies;

        if (!refreshToken) {
          res.status(StatusCode.Unauthorized).json({ message: "Refresh token missing" });
          return;
        }

        try {
          const payload = jwt.verify(refreshToken, refreshKeyToken) as JwtPayload;
          const newAccessToken = jwt.sign({ userId: payload.userId }, accessKeyToken, {
            expiresIn: "15m",
          });

          res.setHeader("Authorization", `Bearer ${newAccessToken}`);
          req.user = { userId: payload.userId }; 
          next();
        } catch {
          res.status(StatusCode.Unauthorized).json({ message: "Invalid refresh token" });
          return;
        }
      } else {
        res.status(StatusCode.Unauthorized).json({ message: "Invalid access token" });
        return;
      }
    }
  } catch (error) {
    console.error("Error in authCheck middleware", error);
    res.status(StatusCode.InternalServerError).json({ message: "Internal server error" });
    return;
  }
};
