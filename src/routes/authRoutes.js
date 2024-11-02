import express from "express";
import {
  signupAdmin,
  createUnderlyingUser,
  signinOrLogin,
  resetAdminPassword,
  updateUnderlyingUserDetails,
} from "../controllers/authController.js";
import { verifyAdminJWT } from "../middlewares/Authentication.middleware.js";

const router = express.Router();

router.route("/signup").post(signupAdmin);
router.route("/login").post(signinOrLogin);
router.route("/createuser").post(verifyAdminJWT,createUnderlyingUser);
router.route("/resetAdminpassword").post(verifyAdminJWT,resetAdminPassword);
router.route("/updateuser").put(verifyAdminJWT,updateUnderlyingUserDetails); 

export default router;
