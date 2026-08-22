import mongoose, { Schema, Document } from "mongoose";

export interface IMatch extends Document {
  tournament: mongoose.Types.ObjectId;
  playerOne: mongoose.Types.ObjectId;
  playerTwo: mongoose.Types.ObjectId;
  winner?: mongoose.Types.ObjectId;
  round?: number;
  status: "pending" | "ongoing" | "completed" | "disputed";
  scheduledAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const MatchSchema: Schema = new Schema(
  {
    tournament: { type: Schema.Types.ObjectId, ref: "Tournament", required: true },
    playerOne: { type: Schema.Types.ObjectId, ref: "User", required: true },
    playerTwo: { type: Schema.Types.ObjectId, ref: "User", required: true },
    winner: { type: Schema.Types.ObjectId, ref: "User" },
    round: { type: Number },
    status: {
      type: String,
      enum: ["pending", "ongoing", "completed", "disputed"],
      default: "pending",
    },
    scheduledAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.models.Match || mongoose.model<IMatch>("Match", MatchSchema);
