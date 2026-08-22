import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  passwordHash: string;
  avatar?: string;
  favoriteGenres?: string[];
  favoriteGames?: mongoose.Types.ObjectId[];
  followedTags?: string[];
  role: "user" | "admin" | "organizer";
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    avatar: { type: String },
    favoriteGenres: [{ type: String }],
    favoriteGames: [{ type: Schema.Types.ObjectId, ref: "Game" }],
    followedTags: [{ type: String }],
    role: { type: String, enum: ["user", "admin", "organizer"], default: "user" },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
