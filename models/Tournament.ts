import mongoose, { Schema, Document } from "mongoose";

export interface ITournament extends Document {
  title: string;
  description?: string;
  game: mongoose.Types.ObjectId;
  startDate: Date;
  endDate?: Date;
  registrationDeadline?: Date;
  maxParticipants?: number;
  participants: mongoose.Types.ObjectId[];
  status: "pending_approval" | "upcoming" | "registration_open" | "ongoing" | "completed" | "cancelled";
  bracketType?: string;
  rules?: string;
  createdBy: mongoose.Types.ObjectId;
  testRunId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TournamentSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    game: { type: Schema.Types.ObjectId, ref: "Game", required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    registrationDeadline: { type: Date },
    maxParticipants: { type: Number },
    participants: [{ type: Schema.Types.ObjectId, ref: "User" }],
    status: {
      type: String,
      enum: ["pending_approval", "upcoming", "registration_open", "ongoing", "completed", "cancelled"],
      default: "pending_approval",
    },
    bracketType: { type: String },
    rules: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    testRunId: { type: String },
    },
  { timestamps: true }
);

export default mongoose.models.Tournament || mongoose.model<ITournament>("Tournament", TournamentSchema);
