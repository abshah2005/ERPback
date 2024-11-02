import mongoose,{Schema} from "mongoose";
const AccountSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    account_type_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AccountType", 
      required: true,
    },
    bankName: {
      type: String,
      trim: true,
    },
    branch: {
      type: String,
      trim: true,
    },
    accountTitle: {
      type: String,
      trim: true,
    },
    accountNo: {
      type: String,
      trim: true,
      unique: true,
    },
    CompanyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company", // Reference to Company
      required: true,
    },
  },
  { timestamps: true }
);

export const Account = mongoose.model("Account", AccountSchema);
