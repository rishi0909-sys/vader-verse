import mongoose, { Schema, Document } from "mongoose";

export interface IGameSession extends Document {
  user: mongoose.Types.ObjectId;
  game: mongoose.Types.ObjectId;
  sessionDuration: number;
  startedAt: Date;
  endedAt?: Date;
  testRunId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const GameSessionSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    game: { type: Schema.Types.ObjectId, ref: "Game", required: true },
    sessionDuration: { type: Number, default: 0 },
    startedAt: { type: Date, default: Date.now },
    endedAt: { type: Date },
    testRunId: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.GameSession || mongoose.model<IGameSession>("GameSession", GameSessionSchema);
