import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  name: string;
  email: string;
  subject?: string;
  message: string;
  status: 'UNREAD' | 'READ';
  createdAt: Date;
}

const MessageSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ['UNREAD', 'READ'],
      default: 'UNREAD',
    },
  },
  { timestamps: true }
);

export const Message = mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema);