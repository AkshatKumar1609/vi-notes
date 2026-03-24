import mongoose, { Schema, Document } from 'mongoose';

export interface IKeystrokeEvent {
  timestamp: number; // milliseconds since session start
  keyCode: number;
  duration: number; // milliseconds key was held
}

export interface IPasteEvent {
  timestamp: number; // milliseconds since session start
  textLength: number; // number of characters pasted
  position: number; // cursor position in editor
}

export interface IWritingSession extends Document {
  userId: mongoose.Types.ObjectId;
  content: string; // Final written content
  keystrokeEvents: IKeystrokeEvent[];
  pasteEvents: IPasteEvent[];
  sessionStartTime: Date;
  sessionEndTime?: Date;
  totalDuration?: number; // milliseconds
  totalKeystrokes: number;
  totalPastes: number;
  contentLength: number;
  createdAt: Date;
  updatedAt: Date;
}

const WritingSessionSchema = new Schema<IWritingSession>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      default: '',
    },
    keystrokeEvents: [
      {
        timestamp: {
          type: Number,
          required: true,
        },
        keyCode: {
          type: Number,
          required: true,
        },
        duration: {
          type: Number,
          required: true,
        },
      },
    ],
    pasteEvents: [
      {
        timestamp: {
          type: Number,
          required: true,
        },
        textLength: {
          type: Number,
          required: true,
        },
        position: {
          type: Number,
          required: true,
        },
      },
    ],
    sessionStartTime: {
      type: Date,
      default: Date.now,
    },
    sessionEndTime: {
      type: Date,
    },
    totalDuration: {
      type: Number,
    },
    totalKeystrokes: {
      type: Number,
      default: 0,
    },
    totalPastes: {
      type: Number,
      default: 0,
    },
    contentLength: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IWritingSession>('WritingSession', WritingSessionSchema);
