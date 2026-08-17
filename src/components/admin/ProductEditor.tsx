'use client';

import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { X, Loader2, Save } from 'lucide-react';
import { saveProduct } from '@/actions/admin/products';
import { ImageUploadField } from './ImageUploadField';

export function ProductEditor({ product, businesses, isOpen, onClose, onSuccess }: any) {
  const [isSaving, setIsSaving] = useState(false);
  const { register, handleSubmit, reset, control } = useForm();
  const isNew = !product || !product._id;

  useEffect(() => {
    if (isOpen) {
      reset(product ? {
        ...product,
        features: product.features?.join(', ') || '' // Convert array back to string for editing
      } : {
        name: '', slug: '', businessId: '', shortDescription: '', fullDescription: '',
        imageUrl: '', features: '', status: 'DRAFT'
      });
    }
  }, [product, isOpen, reset]);

  const onSubmit = async (data: any) => {
    setIsSaving(true);
    const res = await saveProduct(data, product?._id);
    if (res.success) {
      onSuccess(res.product, isNew);
      onClose();
    } else {
      alert(res.error || 'Failed to save');
    }
    setIsSaving(false);
  };

  return (
    <div className={`fixed inset-0 z-50 flex justify-end transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm" onClick={onClose} />
      
      <div className={`relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h3 className="font-semibold text-slate-800">{isNew ? 'Add Product / Brand' : 'Edit Product'}</h3>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-700 rounded-full">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <form id="product-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Product Name</label>
                <input type="text" {...register('name', { required: true })} className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm outline-none focus:border-[rgb(var(--color-primary))]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">URL Slug</label>
                <input type="text" {...register('slug', { required: true })} className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm outline-none focus:border-[rgb(var(--color-primary))]" placeholder="e.g. product-name" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Parent Business</label>
                <select {...register('businessId', { required: true })} className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm outline-none focus:border-[rgb(var(--color-primary))] bg-white">
                  <option value="">-- Select Business --</option>
                  {businesses.map((b: any) => (
                    <option key={b._id} value={b._id}>{b.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Status</label>
                <select {...register('status')} className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm outline-none focus:border-[rgb(var(--color-primary))] bg-white">
                  <option value="PUBLISHED">Published (Live)</option>
                  <option value="DRAFT">Draft (Hidden)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Short Description</label>
              <textarea {...register('shortDescription')} rows={2} className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm outline-none focus:border-[rgb(var(--color-primary))] resize-none" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Full Description</label>
              <textarea {...register('fullDescription')} rows={4} className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm outline-none focus:border-[rgb(var(--color-primary))] resize-none" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Key Features (Comma Separated)</label>
              <input type="text" {...register('features')} className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm outline-none focus:border-[rgb(var(--color-primary))]" placeholder="Feature 1, Feature 2, Feature 3" />
            </div>

            <div className="pt-4 border-t border-slate-100">
              <Controller name="imageUrl" control={control} render={({ field }) => (
                <ImageUploadField label="Product Image" value={field.value} onChange={field.onChange} />
              )} />
            </div>

          </form>
        </div>

        <div className="p-4 border-t border-slate-100 flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-md hover:bg-slate-50 font-medium text-sm">Cancel</button>
          <button type="submit" form="product-form" disabled={isSaving} className="flex-1 px-4 py-2 bg-[rgb(var(--color-primary))] text-white rounded-md hover:bg-opacity-90 font-medium text-sm flex justify-center items-center gap-2">
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Product
          </button>
        </div>
      </div>
    </div>
  );
}