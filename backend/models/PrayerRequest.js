import mongoose from "mongoose";

const prayerRequestSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    requestText: { type: String, required: true },
    responses: [
      {
        type: String, // "Prayed", "Amen", "Stay strong", etc
        timestamp: { type: Date, default: Date.now }
      }
    ],
  },
  { timestamps: true }
);

// Auto delete after 24 hours
prayerRequestSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

export default mongoose.model("PrayerRequest", prayerRequestSchema);