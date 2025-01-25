import jwt from "jsonwebtoken";
import crypto from "crypto";
import config from "../config/index.js";

const accessKeyToken = config.jwt_access_key;
const refreshKeyToken = config.jwt_refresh_key;
const accessTokenExpire = "15m";
const refreshTokenExpire = "7d";

if (!accessKeyToken || !refreshKeyToken) {
  throw Error("Access token or refresh token secret key are missing");
}

const hashedUserId = (userId: string): string => {
  return crypto.createHash("sha256").update(userId).digest("hex");
};

export const generateTokens = (userId: string) => {
  const hashedId = hashedUserId(userId);

  const accessToken =  jwt.sign({ userId: hashedId }, accessKeyToken, {
      expiresIn: accessTokenExpire,
    });
  
  const refreshToken =  jwt.sign({ userId: hashedId }, refreshKeyToken, {
      expiresIn: refreshTokenExpire,
    });


  return {
    accessToken,
    refreshToken,
  };
};
