import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  type: { 
    type: String, 
    enum: ['NEWS', 'EVENT', 'NOTICE'], 
    default: 'NEWS',
    required: true
  },
  content: { type: String, required: true }, // This will hold our Rich Text (HTML)
  coverImageUrl: { type: String }, // For the thumbnail/image
  documentUrl: { type: String }, // Specifically for uploaded PDFs
  status: { type: String, enum: ['PUBLISHED', 'DRAFT'], default: 'DRAFT' },
  publishDate: { type: Date, default: Date.now },
}, { timestamps: true });

export const Article = mongoose.models.Article || mongoose.model('Article', articleSchema);