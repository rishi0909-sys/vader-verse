import mongoose, { Schema, Document } from "mongoose";

export interface INews extends Document {
  title: string;
  description?: string;
  content: string;
  source?: string;
  url?: string;
  image?: string;
  genres?: string[];
  tags?: string[];
  publishedAt?: Date;
  testRunId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const NewsSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    content: { type: String, required: true },
    source: { type: String },
    url: { type: String },
    image: { type: String },
    genres: [{ type: String }],
    tags: [{ type: String }],
    publishedAt: { type: Date },
    testRunId: { type: String },
    },
  { timestamps: true }
);

export default mongoose.models.News || mongoose.model<INews>("News", NewsSchema);
