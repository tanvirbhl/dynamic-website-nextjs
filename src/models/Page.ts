import mongoose, { Schema, Document } from 'mongoose';

export interface IPage extends Document {
  title: string;
  slug: string;
  status: 'DRAFT' | 'PUBLISHED' | 'DISABLED' | 'ARCHIVED';
  seo: {
    title?: string;
    description?: string;
    keywords?: string;
    ogImage?: string;
  };
  // We don't embed sections directly to keep the document size small and allow independent section fetching
}

const PageSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    status: {
      type: String,
      enum: ['DRAFT', 'PUBLISHED', 'DISABLED', 'ARCHIVED'],
      default: 'DRAFT',
      index: true,
    },
    seo: {
      title: String,
      description: String,
      keywords: String,
      ogImage: String,
    },
  },
  { timestamps: true }
);

// Prevent Next.js hot-reload model overwrite errors
export const Page = mongoose.models.Page || mongoose.model<IPage>('Page', PageSchema);