'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, Loader2, Save } from 'lucide-react';
import { savePage } from '@/actions/admin/pages';

interface PageEditorProps {
  page: any | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (savedPage: any, isNew: boolean) => void;
}

export function PageEditor({ page, isOpen, onClose, onSuccess }: PageEditorProps) {
  const [isSaving, setIsSaving] = useState(false);
  const { register, handleSubmit, reset, formState: { isDirty } } = useForm();
  const isNew = !page || !page._id;

  useEffect(() => {
    if (isOpen) {
      reset(page ? {
        title: page.title,
        slug: page.slug,
        status: page.status,
        seo: page.seo || { title: '', description: '' }
      } : {
        title: '',
        slug: '',
        status: 'DRAFT',
        seo: { title: '', description: '' }
      });
    }
  }, [page, isOpen, reset]);

  const onSubmit = async (data: any) => {
    setIsSaving(true);
    
    const res = await savePage(data, page?._id);
    
    if (res.success) {
      onSuccess(res.page, isNew);
      onClose();
    } else {
      alert(res.error || 'Failed to save page');
    }
    
    setIsSaving(false);
  };

  return (
    <div className={`fixed inset-0 z-50 flex justify-end transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm" onClick={onClose} />
      
      <div className={`relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h3 className="font-semibold text-slate-800">{isNew ? 'Create New Page' : 'Edit Page Settings'}</h3>
            <p className="text-xs text-slate-500">Manage route details and SEO.</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-700 rounded-full transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <form id="page-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-800 border-b pb-2">Core Settings</h4>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Page Title</label>
                <input type="text" {...register('title', { required: true })} className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm outline-none focus:border-[rgb(var(--color-primary))] focus:ring-1 focus:ring-[rgb(var(--color-primary))] transition-all" placeholder="e.g., Sustainability" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">URL Slug</label>
                <input type="text" {...register('slug', { required: true })} disabled={page?.slug === 'home'} className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm outline-none focus:border-[rgb(var(--color-primary))] disabled:bg-slate-100 disabled:text-slate-400 transition-all" placeholder="e.g., sustainability" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Publishing Status</label>
                <select {...register('status')} className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm outline-none focus:border-[rgb(var(--color-primary))] transition-all bg-white">
                  <option value="PUBLISHED">Published (Live)</option>
                  <option value="DRAFT">Draft (Hidden)</option>
                </select>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <h4 className="text-sm font-bold text-slate-800 border-b pb-2">Search Engine Optimization</h4>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">SEO Meta Title</label>
                <input type="text" {...register('seo.title')} className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm outline-none focus:border-[rgb(var(--color-primary))] transition-all" placeholder="Optimal length: 50-60 characters" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">SEO Meta Description</label>
                <textarea {...register('seo.description')} rows={3} className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm outline-none focus:border-[rgb(var(--color-primary))] transition-all resize-none" placeholder="Brief summary for search engines..."></textarea>
              </div>
            </div>

          </form>
        </div>

        <div className="p-4 border-t border-slate-100 bg-white flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-md hover:bg-slate-50 transition-colors font-medium text-sm">
            Cancel
          </button>
          <button 
            type="submit" 
            form="page-form" 
            disabled={isSaving || (!isDirty && !isNew)}
            className="flex-1 px-4 py-2 bg-[rgb(var(--color-primary))] text-white rounded-md hover:bg-opacity-90 disabled:opacity-50 transition-all font-medium text-sm flex items-center justify-center gap-2"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isSaving ? 'Saving...' : 'Save Page'}
          </button>
        </div>
      </div>
    </div>
  );
}