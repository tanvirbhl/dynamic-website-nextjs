import mongoose from 'mongoose';

const navigationSchema = new mongoose.Schema({
  label: { type: String, required: true },
  url: { type: String, required: true },
  // If parentId is null, it's a top-level menu item. If it has an ID, it belongs inside a dropdown.
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Navigation', default: null },
  sortOrder: { type: Number, default: 0 },
  isVisible: { type: Boolean, default: true }
}, { timestamps: true });

export const Navigation = mongoose.models.Navigation || mongoose.model('Navigation', navigationSchema);