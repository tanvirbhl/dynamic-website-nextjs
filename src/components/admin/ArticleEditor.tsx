'use client';

import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { X, Loader2, Save } from 'lucide-react';
import { saveArticle } from '@/actions/admin/articles';
import { ImageUploadField } from './ImageUploadField';

export function ArticleEditor({ article, isOpen, onClose, onSuccess }: any) {
  const [isSaving, setIsSaving] = useState(false);
  const { register, handleSubmit, reset, control, watch } = useForm();
  const isNew = !article || !article._id;

  const selectedType = watch('type');

  useEffect(() => {
    if (isOpen) {
      reset(article ? {
        ...article,
        publishDate: article.publishDate ? new Date(article.publishDate).toISOString().slice(0, 16) : ''
      } : {
        title: '', slug: '', type: 'NEWS', content: '',
        coverImageUrl: '', documentUrl: '', status: 'DRAFT',
        publishDate: new Date().toISOString().slice(0, 16)
      });
    }
  }, [article, isOpen, reset]);

  const onSubmit = async (data: any) => {
    try {
      setIsSaving(true);
      const res = await saveArticle(data, article?._id);
      
      if (res.success) {
        onSuccess(res.article, isNew);
        onClose();
      } else {
        alert(res.error || 'Failed to save post.');
      }
    } catch (error: any) {
      console.error(error);
      alert("Error saving post!");
    } finally {
      setIsSaving(false);
    }
  };

  const onValidationError = (errors: any) => {
    console.log("Validation Errors:", errors);
    alert("Please fill out all required fields (Title, URL Slug, and Content).");
  };

  return (
    <div className={`fixed inset-0 z-50 flex justify-end transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm" onClick={onClose} />
      
      <div className={`relative w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h3 className="font-semibold text-slate-800">{isNew ? 'Create Post' : 'Edit Post'}</h3>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-700 rounded-full">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <form id="article-form" className="space-y-6">
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Title *</label>
                <input type="text" {...register('title', { required: true })} className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm outline-none focus:border-[rgb(var(--color-primary))]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">URL Slug *</label>
                <input type="text" {...register('slug', { required: true })} className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm outline-none focus:border-[rgb(var(--color-primary))]" placeholder="e.g. annual-report-2026" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Type</label>
                <select {...register('type')} className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm outline-none focus:border-[rgb(var(--color-primary))] bg-white">
                  <option value="NEWS">News</option>
                  <option value="EVENT">Event</option>
                  <option value="NOTICE">Notice</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Status</label>
                <select {...register('status')} className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm outline-none focus:border-[rgb(var(--color-primary))] bg-white">
                  <option value="PUBLISHED">Published</option>
                  <option value="DRAFT">Draft</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Publish Date</label>
                <input type="datetime-local" {...register('publishDate')} className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm outline-none focus:border-[rgb(var(--color-primary))]" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Content / Description *</label>
              <textarea 
                {...register('content', { required: true })} 
                rows={6}
                placeholder="Write your article or notice content here..."
                className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm outline-none focus:border-[rgb(var(--color-primary))] resize-y" 
              />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
              <Controller name="coverImageUrl" control={control} render={({ field }) => (
                <ImageUploadField label="Cover Image" value={field.value} onChange={field.onChange} />
              )} />
              
              {selectedType === 'NOTICE' && (
                <Controller name="documentUrl" control={control} render={({ field }) => (
                  <ImageUploadField 
                    label="Attach PDF Document" 
                    value={field.value} 
                    onChange={field.onChange} 
                    acceptsPdf={true} 
                  />
                )} />
              )}
            </div>

          </form>
        </div>

        <div className="p-4 border-t border-slate-100 flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-md hover:bg-slate-50 font-medium text-sm">Cancel</button>
          
          <button 
            type="button" 
            onClick={handleSubmit(onSubmit, onValidationError)} 
            disabled={isSaving} 
            className="flex-1 px-4 py-2 bg-[rgb(var(--color-primary))] text-white rounded-md hover:bg-opacity-90 font-medium text-sm flex justify-center items-center gap-2"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} 
            {isSaving ? 'Saving...' : 'Save Post'}
          </button>
        </div>
      </div>
    </div>
  );
}