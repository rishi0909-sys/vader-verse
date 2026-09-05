import mongoose, { Schema, Document } from "mongoose";

export interface ILinkedAccount extends Document {
  userId: mongoose.Types.ObjectId;
  provider: string;
  providerAccountId: string;
  createdAt: Date;
  updatedAt: Date;
}

const LinkedAccountSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    provider: { type: String, required: true },
    providerAccountId: { type: String, required: true },
  },
  { timestamps: true }
);

// Ensure a provider account can only be linked once
LinkedAccountSchema.index({ provider: 1, providerAccountId: 1 }, { unique: true });

export default mongoose.models.LinkedAccount || mongoose.model<ILinkedAccount>("LinkedAccount", LinkedAccountSchema);
