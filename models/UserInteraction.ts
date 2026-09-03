import mongoose, { Schema, Document } from "mongoose";

export interface IUserInteraction extends Document {
  userId: mongoose.Types.ObjectId;
  itemId:  mongoose.Types.ObjectId;
  itemType: "game" | "article" | "tournament";
  action: "view" | "click" | "like" | "save" | "play" | "read" | "join" | "search" | "dislike" | "skip";
  duration?: number;
  metadata?: any;
  testRunId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserInteractionSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    itemId: { type: Schema.Types.ObjectId, required: true },
    itemType: { type: String, enum: ["game", "article", "tournament"], required: true },
    action: {
      type: String,
      enum: ["view", "click", "like", "save", "play", "read", "join", "search", "dislike", "skip"],
      required: true,
    },
    duration: { type: Number },
    metadata: { type: Schema.Types.Mixed },
    testRunId: { type: String },
    },
  { timestamps: true }
);

export default mongoose.models.UserInteraction ||
  mongoose.model<IUserInteraction>("UserInteraction", UserInteractionSchema);
