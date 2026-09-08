import mongoose, { Schema, Document } from "mongoose";

export interface IAiTelemetryEvent extends Document {
  userId: mongoose.Types.ObjectId; // Only tracking logged-in users as requested
  eventType: "click" | "view" | "session_start" | "session_end" | "scroll" | "hover";
  category: string; // e.g., 'news_card', 'tournament_modal', 'navigation'
  entityId?: string; // e.g., tournament ID or news article ID
  metadata?: any; // Flexible JSON for duration in ms, coordinates, etc.
  aiProcessed: boolean; // Flag for whether the background AI job has ingested this yet
  createdAt: Date;
}

const AiTelemetryEventSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    eventType: {
      type: String,
      enum: ["click", "view", "session_start", "session_end", "scroll", "hover"],
      required: true,
    },
    category: { type: String, required: true },
    entityId: { type: String },
    metadata: { type: Schema.Types.Mixed },
    aiProcessed: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: true, updatedAt: false } } // Telemetry is append-only, no updates
);

// Index for fast querying by the AI admin service (e.g. finding unprocessed events)
AiTelemetryEventSchema.index({ aiProcessed: 1, createdAt: -1 });
AiTelemetryEventSchema.index({ userId: 1, createdAt: -1 });
AiTelemetryEventSchema.index({ category: 1, eventType: 1 });

export default mongoose.models.AiTelemetryEvent ||
  mongoose.model<IAiTelemetryEvent>("AiTelemetryEvent", AiTelemetryEventSchema);
