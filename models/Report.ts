import mongoose, { Schema, Document } from "mongoose";

export interface IReport extends Document {
  reporter: mongoose.Types.ObjectId;
  reportedUser?: mongoose.Types.ObjectId;
  reportedContentId?: mongoose.Types.ObjectId;
  reportedContentType?: "game" | "news" | "tournament" | "community" | "message";
  reason: string;
  description: string;
  status: "pending" | "reviewed" | "dismissed" | "action_taken";
  reviewedBy?: mongoose.Types.ObjectId;
  reviewedAt?: Date;
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReportSchema: Schema = new Schema(
  {
    reporter: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    reportedUser: { type: Schema.Types.ObjectId, ref: "User", index: true },
    reportedContentId: { type: Schema.Types.ObjectId },
    reportedContentType: { 
      type: String, 
      enum: ["game", "news", "tournament", "community", "message"] 
    },
    reason: { type: String, required: true },
    description: { type: String, required: true, maxlength: 2000 },
    status: {
      type: String,
      enum: ["pending", "reviewed", "dismissed", "action_taken"],
      default: "pending",
      index: true
    },
    reviewedBy: { type: Schema.Types.ObjectId, ref: "User" },
    reviewedAt: { type: Date },
    adminNotes: { type: String, maxlength: 2000 },
  },
  { timestamps: true }
);

export default mongoose.models.Report || mongoose.model<IReport>("Report", ReportSchema);
