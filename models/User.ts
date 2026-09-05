import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  passwordHash?: string;
  avatar?: string;
  favoriteGenres?: string[];
  favoriteGames?: mongoose.Types.ObjectId[];
  followedTags?: string[];
  role: "user" | "admin" | "organizer";
  testRunId?: string;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String },
    avatar: { type: String },
    favoriteGenres: [{ type: String }],
    favoriteGames: [{ type: Schema.Types.ObjectId, ref: "Game" }],
    followedTags: [{ type: String }],
    role: { type: String, enum: ["user", "admin", "organizer"], default: "user" },
    testRunId: { type: String },
    onboardingCompleted: { type: Boolean, default: false },
    isEmailVerified: { type: Boolean, default: false },
    },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
