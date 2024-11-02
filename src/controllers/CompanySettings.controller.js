import { CompanySettings } from "../models/CompanySetting.model.js";
import { Apierror } from "../utils/Apierror.js";
import { asynchandler } from "../utils/Asynchandler.js";

export const getCompanySettings = asynchandler(async (req, res) => {
  const { companyId } = req.params;
  const settings = await CompanySettings.findOne({ companyId: companyId });

  if (!settings) {
    throw new Apierror(404, "Settings not found for this company.");
  }

  return res.status(200).json(settings);
});

export const updateCompanySettings = asynchandler(async (req, res) => {
  const { companyId } = req.params;
  const updatedSettings = req.body;

  const settings = await CompanySettings.findOneAndUpdate(
    { companyId },
    { $set: updatedSettings },
    { new: true, runValidators: true }
  );

  if (!settings) {
    throw new Apierror(404, "Settings not found.");
  }

  return res.status(200).json({ message: "Settings updated successfully", settings });
});
