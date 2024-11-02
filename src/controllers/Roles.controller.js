import { Role } from '../models/Roles.model.js'; 
import { Apierror } from '../utils/Apierror.js'; 
import { asynchandler } from '../utils/Asynchandler.js'; 

export const createRole = asynchandler(async (req, res) => {
  const { name } = req.body;

  const existingRole = await Role.findOne({ name:name });
  if (existingRole) {
    throw new Apierror(400, "Role already exists");
  }

  const newRole = new Role({ name });
  await newRole.save();
  res.status(201).json({ message: "Role created successfully", role: newRole });
});

export const getAllRoles = asynchandler(async (req, res) => {
  const roles = await Role.find();
  res.status(200).json({ roles });
});

export const getRoleById = asynchandler(async (req, res) => {
  const roleId = req.params.id;
  const role = await Role.findById(roleId);

  if (!role) {
    throw new Apierror(404, "Role not found");
  }

  res.status(200).json({ role });
});

export const updateRole = asynchandler(async (req, res) => {
  const roleId = req.params.id;
  const { name } = req.body;

  
  const existingRole = await Role.findOne({ name });
  if (existingRole && existingRole._id.toString() !== roleId) {
    throw new Apierror(400, "Role name already exists");
  }

  const updatedRole = await Role.findByIdAndUpdate(roleId, { name }, { new: true, runValidators: true });

  if (!updatedRole) {
    throw new Apierror(404, "Role not found");
  }

  res.status(200).json({ message: "Role updated successfully", role: updatedRole });
});

export const deleteRole = asynchandler(async (req, res) => {
  const roleId = req.params.id;
  
  const deletedRole = await Role.findByIdAndDelete(roleId);
  if (!deletedRole) {
    throw new Apierror(404, "Role not found");
  }

  res.status(200).json({ message: "Role deleted successfully" });
});
