'use client';

import { CldUploadWidget } from 'next-cloudinary';
import { ImagePlus, X, FileText } from 'lucide-react';

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  acceptsPdf?: boolean; //
}

export function ImageUploadField({ label, value, onChange, acceptsPdf = false }: ImageUploadFieldProps) {
  
  // Determine if the current value is a PDF
  const isPdf = value?.toLowerCase().endsWith('.pdf');

  return (
    <div className="w-full">
      <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">{label}</label>
      
      {value ? (
        <div className="relative w-full h-32 bg-slate-50 border border-slate-200 rounded-md overflow-hidden flex items-center justify-center group">
          {isPdf ? (
            <div className="flex flex-col items-center justify-center text-slate-500">
              <FileText size={32} className="mb-2 text-[rgb(var(--color-primary))]" />
              <span className="text-xs font-medium">PDF Document Uploaded</span>
            </div>
          ) : (
            <img src={value} alt="Uploaded preview" className="w-full h-full object-contain" />
          )}
          
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              type="button"
              onClick={() => onChange('')}
              className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      ) : (
        <CldUploadWidget 
          uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
          onSuccess={(result: any) => {
            onChange(result.info.secure_url);
          }}
          options={{
            maxFiles: 1,
            // Allow auto resource type if acceptsPdf is true, otherwise restrict to image
            resourceType: acceptsPdf ? "auto" : "image",
            clientAllowedFormats: acceptsPdf ? ["png", "jpeg", "jpg", "webp", "pdf"] : ["png", "jpeg", "jpg", "webp"]
          }}
        >
          {({ open }) => (
            <button
              type="button"
              onClick={() => open()}
              className="w-full h-32 border-2 border-dashed border-slate-300 rounded-md flex flex-col items-center justify-center text-slate-500 hover:text-[rgb(var(--color-primary))] hover:border-[rgb(var(--color-primary))] hover:bg-slate-50 transition-all"
            >
              <ImagePlus size={24} className="mb-2" />
              <span className="text-sm font-medium">
                {acceptsPdf ? 'Click to upload Image or PDF' : 'Click to upload image'}
              </span>
            </button>
          )}
        </CldUploadWidget>
      )}
    </div>
  );
}