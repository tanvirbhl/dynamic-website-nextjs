import mongoose from 'mongoose';

const businessSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  shortDescription: { type: String, required: true }, // For the grid cards
  fullDescription: { type: String }, // For the individual profile page
  logoUrl: { type: String },
  coverImageUrl: { type: String },
  websiteUrl: { type: String },
  status: { type: String, enum: ['PUBLISHED', 'DRAFT'], default: 'DRAFT' },
  sortOrder: { type: Number, default: 0 },
}, { timestamps: true });

export const Business = mongoose.models.Business || mongoose.model('Business', businessSchema);