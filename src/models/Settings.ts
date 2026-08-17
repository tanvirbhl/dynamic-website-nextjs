import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  brandName: { type: String, default: 'Nova Industries' },
  logoUrl: { type: String, default: '' }, // We'll use Cloudinary for this!
  footerText: { type: String, default: '© {year} Nova Industries PLC. All rights reserved.' },
  contactEmail: { type: String, default: 'contact@example.com' },
}, { timestamps: true });

export const Settings = mongoose.models.Settings || mongoose.model('Settings', settingsSchema);