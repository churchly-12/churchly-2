import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://church_admin:25112025churchme@church-app.xqcry5c.mongodb.net/church-app?retryWrites=true&w=majority&appName=church-app",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("MongoDB Connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1); // stop server if connection fails
  }
};
