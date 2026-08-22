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
  status: "upcoming" | "registration_open" | "ongoing" | "completed" | "cancelled";
  bracketType?: string;
  rules?: string;
  createdBy: mongoose.Types.ObjectId;
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
      enum: ["upcoming", "registration_open", "ongoing", "completed", "cancelled"],
      default: "upcoming",
    },
    bracketType: { type: String },
    rules: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Tournament || mongoose.model<ITournament>("Tournament", TournamentSchema);
