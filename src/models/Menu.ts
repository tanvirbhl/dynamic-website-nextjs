import mongoose, { Schema, Document } from 'mongoose';

export interface IMenuItem extends Document {
  label: string;
  url: string;
  isActive: boolean;
  sortOrder: number;
  parentId?: mongoose.Types.ObjectId | null;
  openInNewTab: boolean;
}

const MenuItemSchema = new Schema(
  {
    label: { type: String, required: true },
    url: { type: String, required: true },
    isActive: { type: Boolean, default: true, index: true },
    sortOrder: { type: Number, default: 0, index: true },
    parentId: { type: Schema.Types.ObjectId, ref: 'MenuItem', default: null, index: true },
    openInNewTab: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const MenuItem = mongoose.models.MenuItem || mongoose.model<IMenuItem>('MenuItem', MenuItemSchema);