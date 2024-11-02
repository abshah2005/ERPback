import { AdminUser } from "../models/user.js";
import { UnderlyingUser } from "../models/UnderlyringUsers.model.js";
import jwt from "jsonwebtoken";
import { Apierror } from "../utils/Apierror.js";
import { asynchandler } from "../utils/Asynchandler.js";

const verifyAdminJWT = asynchandler(async (req, res, next) => {
  try {
    const cookieToken = req.cookies?.token;
    const headerToken = req.header("Authorization")?.replace("Bearer ", "");
    const token = cookieToken || headerToken;

    if (!token) {
      throw new Apierror(401, "Unauthorized request: No token provided");
    }

    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);

    const user = await AdminUser.findById(decodedToken.userId);

    if (!user) {
      throw new Apierror(401, "Invalid access token: Admin user not found");
    }

    if (!user.sessionToken || !user.sessionTokenExpiry) {
      throw new Apierror(401, "Session token missing or expired");
    }

    if (token !== user.sessionToken) {
      throw new Apierror(401, "Session token mismatch, please sign in again");
    }

    if (Date.now() > user.sessionTokenExpiry) {
      user.sessionToken = null;
      user.sessionTokenExpiry = null;
      await user.save();
      throw new Apierror(401, "Session expired, please sign in again");
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Apierror(401, "Invalid access token");
    } else if (error instanceof jwt.TokenExpiredError) {
      throw new Apierror(401, "Token has expired");
    }
    throw new Apierror(401, error.message || "Authentication failed");
  }
});

const verifyUnderlyingJWT = asynchandler(async (req, res, next) => {
  try {
    const cookieToken = req.cookies?.token;
    const headerToken = req.header("Authorization")?.replace("Bearer ", "");
    const token = cookieToken || headerToken;

    if (!token) {
      throw new Apierror(401, "Unauthorized request: No token provided");
    }

    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);

    const user = await UnderlyingUser.findById(decodedToken.userId);

    if (!user) {
      throw new Apierror(
        401,
        "Invalid access token: Underlying user not found"
      );
    }

    if (!user.sessionToken || !user.sessionTokenExpiry) {
      throw new Apierror(401, "Session token missing or expired");
    }

    if (token !== user.sessionToken) {
      throw new Apierror(401, "Session token mismatch, please sign in again");
    }

    if (Date.now() > user.sessionTokenExpiry) {
      user.sessionToken = null;
      user.sessionTokenExpiry = null;
      await user.save();
      throw new Apierror(401, "Session expired, please sign in again");
    }

    req.user = user; 
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Apierror(401, "Invalid access token");
    } else if (error instanceof jwt.TokenExpiredError) {
      throw new Apierror(401, "Token has expired");
    }
    throw new Apierror(401, error.message || "Authentication failed");
  }
});

export { verifyAdminJWT, verifyUnderlyingJWT };
