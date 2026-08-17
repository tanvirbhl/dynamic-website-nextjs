import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
  shortDescription: { type: String, required: true },
  fullDescription: { type: String },
  imageUrl: { type: String },
  features: [{ type: String }], // Array of strings for bullet points
  status: { type: String, enum: ['PUBLISHED', 'DRAFT'], default: 'DRAFT' },
  sortOrder: { type: Number, default: 0 },
}, { timestamps: true });

export const Product = mongoose.models.Product || mongoose.model('Product', productSchema);