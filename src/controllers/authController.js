import { AdminUser } from "../models/user.js";
import { UnderlyingUser } from "../models/UnderlyringUsers.model.js";
import { Role } from "../models/Roles.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Apierror } from "../utils/Apierror.js";
import { uploadonCloudinary } from "../utils/Fileupload.js";

const isEmpty = (str) => !str || str.trim() === '';

const createSession = (user) => {
  const sessionToken = jwt.sign(
    { userId: user._id, role: user.associatedRole || "admin" },
    process.env.TOKEN_SECRET,
    { expiresIn: "1h" }
  );

  user.sessionToken = sessionToken;
  user.sessionTokenExpiry = Date.now() + 3600000; 
  user.lastLoggedIn = Date.now();
  user.save();
  
  return sessionToken;
};

export const signupAdmin = async (req, res) => {
  const { fullname, email, password, displayname, phonenumber, packagePlan, expiryDate, gracePeriodDays } = req.body;
  const { profilePic } = req.file || {};

  if ([fullname, email, password, displayname, phonenumber].some(isEmpty)) {
    return res.status(400).json({ message: "All fields are required and cannot be empty" });
  }

  try {
    const existingAdmin = await AdminUser.findOne({ email });
    if (existingAdmin) return res.status(400).json({ message: "Admin user already exists" });

    const proPic = profilePic ? await uploadonCloudinary(profilePic.path) : null;
    if (profilePic && !proPic) {
      return res.status(400).json({ message: "Failed to upload profile picture" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new AdminUser({ 
      fullname, 
      email, 
      password: hashedPassword, 
      displayname, 
      phonenumber, 
      profilePic: proPic ? proPic.url : null, 
      packagePlan, 
      expiryDate, 
      gracePeriodDays 
    });
    await newAdmin.save();
    return res.status(201).json({ message: "Admin user created successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createUnderlyingUser = async (req, res) => {
  const { email, password, fullname, displayname, phonenumber, associatedRole } = req.body;
  const { profilePic } = req.file || {};

  if ([email, password, fullname, displayname, phonenumber].some(isEmpty)) {
    return res.status(400).json({ message: "All fields are required and cannot be empty" });
  }

  try {
    const roleExists = await Role.findById(associatedRole);
    if (!roleExists) {
      return res.status(400).json({ message: "Associated role does not exist" });
    }

    const proPic = profilePic ? await uploadonCloudinary(profilePic.path) : null;
    if (profilePic && !proPic) {
      return res.status(400).json({ message: "Failed to upload profile picture" });
    }

    const existingUser = await UnderlyingUser.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UnderlyingUser({ 
      email, 
      password: hashedPassword, 
      fullname, 
      displayname, 
      phonenumber, 
      profilePic: proPic ? proPic.url : null, 
      associatedRole,
      adminId: req.user._id 
    });
    await newUser.save();
    return res.status(201).json({ message: "Underlying user created successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const signinOrLogin = async (req, res) => {
  const { email, password } = req.body;

  if ([email, password].some(isEmpty)) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const adminUser = await AdminUser.findOne({ email });
    if (adminUser) {
      const isMatch = await bcrypt.compare(password, adminUser.password);
      if (isMatch) {
        const sessionToken = createSession(adminUser);
        return res.status(200).json({
          message: "Admin login successful",
          sessionToken,
          user: {
            id: adminUser._id,
            fullname: adminUser.fullname,
            email: adminUser.email,
            role: "admin"
          }
        });
      }
    }

    const underlyingUser = await UnderlyingUser.findOne({ email }).populate("associatedRole");
    if (underlyingUser) {
      const isMatch = await bcrypt.compare(password, underlyingUser.password);
      if (isMatch) {
        const sessionToken = createSession(underlyingUser);
        return res.status(200).json({
          message: "User login successful",
          sessionToken,
          user: {
            id: underlyingUser._id,
            fullname: underlyingUser.fullname,
            email: underlyingUser.email,
            role: underlyingUser.associatedRole
          }
        });
      }
    }

    return res.status(400).json({ message: "Invalid credentials" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const resetAdminPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  if (isEmpty(email) || isEmpty(newPassword)) {
    return res.status(400).json({ message: "Email and new password are required" });
  }

  try {
    const adminUser = await AdminUser.findOne({ email });
    if (!adminUser) return res.status(404).json({ message: "Admin not found" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    adminUser.password = hashedPassword;
    await adminUser.save();

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateUnderlyingUserDetails = async (req, res) => {
  const { userId, newPassword, associatedRole } = req.body;
  const { profilePic } = req.file || {};

  if (isEmpty(userId)) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    const underlyingUser = await UnderlyingUser.findById(userId);
    if (!underlyingUser) return res.status(404).json({ message: "User not found" });

    if (associatedRole) {
      const roleExists = await Role.findById(associatedRole);
      if (!roleExists) {
        return res.status(400).json({ message: "Associated role does not exist" });
      }
      underlyingUser.associatedRole = associatedRole;
    }

    if (newPassword) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      underlyingUser.password = hashedPassword;
    }

    if (profilePic) {  
      const pfp = await uploadonCloudinary(profilePic.path);  
      if (pfp) {  
        underlyingUser.profilePic = pfp.url;  
      } else {
        return res.status(400).json({ message: "Failed to upload profile picture" });
      }
    }

    await underlyingUser.save();
    return res.status(200).json({ message: "User details updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteUnderlyingUser = async (req, res) => {
  const { userId } = req.params;

  if (isEmpty(userId)) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    const underlyingUser = await UnderlyingUser.findByIdAndDelete(userId);
    if (!underlyingUser) return res.status(404).json({ message: "User not found" });

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
