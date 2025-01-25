import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import config from '../config/index.js'
import { StatusCode } from '../interface/StatusCode.js'

const refreshKeyToken = config.jwt_refresh_key;
const accessKeyToken = config.jwt_access_key;
const accessTokenExpire = "15m";
const refreshTokenExpire = "7d";

export const refreshTokenHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {        
      res.status(StatusCode.Unauthorized).json({ message: "Refresh token not provided" });
      return;
    }

    let payload: any;
    try {
      payload = jwt.verify(refreshToken, refreshKeyToken);
    } catch (error) {
      console.log("Invalid refresh token", error);
      res.status(StatusCode.Unauthorized).json({ message: "Invalid refresh token" });
      return;
    }

    const userId = payload.userId; 

    const newAccessToken = jwt.sign({ userId }, accessKeyToken, { expiresIn: accessTokenExpire });
    const newRefreshToken = jwt.sign({ userId }, refreshKeyToken, { expiresIn: refreshTokenExpire });

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    });

    res.status(StatusCode.OK).json({
      message: "Tokens refreshed successfully",
      accessToken: newAccessToken,
    });
  } catch (error) {
    console.log("Error in refresh token handler", error);
    res.status(StatusCode.InternalServerError).json({ message: "Internal server error" });
  }
};
