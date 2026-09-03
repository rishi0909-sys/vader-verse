import mongoose, { Schema, Document } from "mongoose";

export interface IUserPreference extends Document {
  // Legacy / Compatibility fields
  userId: mongoose.Types.ObjectId;
  topGenres: string[];
  topTags: string[];
  favoriteGames: string[];
  currentInterests: string[];
  genreScores: Map<string, number>;
  tagScores: Map<string, number>;
  
  // New Canonical Bubble Model fields
  longTerm: { genres: Map<string, number>; tags: Map<string, number> };
  recent: { genres: Map<string, number>; tags: Map<string, number> };
  emerging: Array<{ name: string; type: string; growthRate: number }>;
  negativeSignals: { genres: Map<string, number>; tags: Map<string, number> };
  confidence: Map<string, number>;
  
  // Storage for incremental confidence mathematics (Stage 5)
  confidenceMetrics: {
    genres: Map<string, { evidenceCount: number; explicitPositive: number; uniqueItems: string[] }>;
    tags: Map<string, { evidenceCount: number; explicitPositive: number; uniqueItems: string[] }>;
  };
  
  // System fields
  lastProcessedAt: Date;
  testRunId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserPreferenceSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    
    // Legacy fields
    topGenres: [{ type: String }],
    topTags: [{ type: String }],
    favoriteGames: [{ type: String }],
    currentInterests: [{ type: String }],
    genreScores: { type: Map, of: Number, default: {} },
    tagScores: { type: Map, of: Number, default: {} },
    
    // New Bubble fields
    longTerm: {
      genres: { type: Map, of: Number, default: {} },
      tags: { type: Map, of: Number, default: {} }
    },
    recent: {
      genres: { type: Map, of: Number, default: {} },
      tags: { type: Map, of: Number, default: {} }
    },
    emerging: [{
      name: { type: String, required: true },
      type: { type: String, required: true },
      growthRate: { type: Number, required: true }
    }],
    negativeSignals: {
      genres: { type: Map, of: Number, default: {} },
      tags: { type: Map, of: Number, default: {} }
    },
    confidence: { type: Map, of: Number, default: {} },
    
    // Confidence metrics
    confidenceMetrics: {
      genres: { type: Map, of: Schema.Types.Mixed, default: {} },
      tags: { type: Map, of: Schema.Types.Mixed, default: {} }
    },
    
    // System fields
    lastProcessedAt: { type: Date, default: null },
    testRunId: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.UserPreference ||
  mongoose.model<IUserPreference>("UserPreference", UserPreferenceSchema);
