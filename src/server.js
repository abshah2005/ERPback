import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js"
import RolesRoutes from "./routes/Roles.route.js"
import CompanyRoutes from "./routes/Company.route.js"
import SettingsRoutes from "./routes/companySetting.route.js"
import CategoryRoutes from "./routes/Categories.route.js"
import AccountTypeRoutes from "./routes/AccountType.route.js"
import Accountroutes from "./routes/Account.route.js"
import CustomerRoutes from "./routes/Customer.route.js"
import VendorRoutes from "./routes/Vendors.route.js"
import unitRoutes from "./routes/Unit.route.js"
import ProductRoutes from "./routes/Products.route.js"

import connectDB from "./config/db.js";

dotenv.config();

const app = express();
connectDB()
app.use(cors());

app.use(express.json());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use("/api/auth", authRoutes);
app.use("/api/role",RolesRoutes);
app.use("/api/company",CompanyRoutes);
app.use("/api/CompanySettings",SettingsRoutes);
app.use("/api/Categories",CategoryRoutes)
app.use("/api/AccountType",AccountTypeRoutes)
app.use("/api/accounts",Accountroutes)
app.use("/api/customers",CustomerRoutes)
app.use("/api/vendors",VendorRoutes)
app.use("/api/units",unitRoutes)
app.use("/api/products",ProductRoutes)



const port = process.env.PORT ;
app.listen(port, () => {
  console.log(`Server Started at port ${port}`);
});
export { app };
