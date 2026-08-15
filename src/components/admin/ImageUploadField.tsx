'use client';

import { useState } from 'react';
import { Upload, Loader2, X, Image as ImageIcon } from 'lucide-react';
import { uploadImageToCloudinary } from '@/actions/admin/upload';

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
}

export function ImageUploadField({ label, value, onChange }: ImageUploadFieldProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    const res = await uploadImageToCloudinary(formData);
    if (res.success && res.url) {
      onChange(res.url);
    } else {
      alert(res.error || 'Upload failed');
    }
    setIsUploading(false);
  };

  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
        {label}
      </label>

      <div className="space-y-3">
        {/* Preview Box */}
        {value && (
          <div className="relative w-full h-36 bg-slate-100 rounded-md border border-slate-200 overflow-hidden group">
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute top-2 right-2 bg-slate-900/70 hover:bg-slate-900 text-white p-1 rounded-full transition-colors"
              title="Remove image"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* Upload Button Box */}
        <div className="flex items-center gap-3">
          <label className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-dashed rounded-md cursor-pointer transition-all text-sm font-medium ${
            isUploading 
              ? 'bg-slate-50 border-slate-300 text-slate-400 cursor-not-allowed' 
              : 'border-slate-300 hover:border-[rgb(var(--color-primary))] text-slate-600 hover:text-[rgb(var(--color-primary))] bg-white'
          }`}>
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Uploading to Cloudinary...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                {value ? 'Change Image' : 'Upload Image File'}
              </>
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={isUploading}
              onChange={handleFileChange}
            />
          </label>
        </div>

        {/* Fallback URL Input (Optional manual editing) */}
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Or paste direct image URL..."
          className="w-full px-3 py-1.5 border border-slate-200 rounded-md text-xs text-slate-500 outline-none focus:border-[rgb(var(--color-primary))]"
        />
      </div>
    </div>
  );
}