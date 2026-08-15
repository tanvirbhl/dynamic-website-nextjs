import mongoose, { Schema, Document } from 'mongoose';

export interface ISection extends Document {
  pageId: mongoose.Types.ObjectId;
  type: string; // e.g., 'hero', 'about', 'businesses', 'products'
  content: any; // Flexible JSON payload depending on the section type
  sortOrder: number;
  isVisible: boolean;
  schedule?: {
    startDate?: Date;
    endDate?: Date;
  };
}

const SectionSchema = new Schema(
  {
    pageId: { type: Schema.Types.ObjectId, ref: 'Page', required: true, index: true },
    type: { type: String, required: true },
    content: { type: Schema.Types.Mixed, default: {} },
    sortOrder: { type: Number, default: 0, index: true },
    isVisible: { type: Boolean, default: true, index: true },
    schedule: {
      startDate: { type: Date },
      endDate: { type: Date },
    },
  },
  { timestamps: true }
);

export const Section = mongoose.models.Section || mongoose.model<ISection>('Section', SectionSchema);