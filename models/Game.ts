import mongoose, { Schema, Document } from "mongoose";

export interface IGame extends Document {
  title: string;
  slug: string;
  description?: string;
  genres?: string[];
  platforms?: string[];
  coverImage?: string;
  rawgId?: string;
  playCount: number;
  rating?: number;
  createdAt: Date;
  updatedAt: Date;
}

const GameSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    genres: [{ type: String }],
    platforms: [{ type: String }],
    coverImage: { type: String },
    rawgId: { type: String },
    playCount: { type: Number, default: 0 },
    rating: { type: Number },
  },
  { timestamps: true }
);

export default mongoose.models.Game || mongoose.model<IGame>("Game", GameSchema);
