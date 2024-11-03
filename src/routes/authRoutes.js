import express from "express";
import {
  signupAdmin,
  createUnderlyingUser,
  signinOrLogin,
  resetAdminPassword,
  updateUnderlyingUserDetails,
  deleteUnderlyingUser
} from "../controllers/authController.js";
import { verifyAdminJWT } from "../middlewares/Authentication.middleware.js";
import {upload} from "../middlewares/Multer.middleware.js"
const router = express.Router();

router.route("/signup").post(upload.single("profilePic"),signupAdmin);
router.route("/login").post(signinOrLogin);
router.route("/createuser").post(verifyAdminJWT,upload.single("profilePic"),createUnderlyingUser);
router.route("/resetAdminpassword").post(verifyAdminJWT,resetAdminPassword);
router.route("/updateuser").put(verifyAdminJWT,upload.single("profilePic"),updateUnderlyingUserDetails); 
router.route("/deleteUser/:userId").delete(verifyAdminJWT,deleteUnderlyingUser);

export default router;
