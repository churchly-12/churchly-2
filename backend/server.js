import express from "express";
import { connectDB } from "./config/db.js";
import prayerRoutes from "./routes/prayerRoutes.js";

const app = express();
const PORT = 5000;

app.use(express.json());

connectDB(); // connect to MongoDB

app.use("/api/prayers", prayerRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))