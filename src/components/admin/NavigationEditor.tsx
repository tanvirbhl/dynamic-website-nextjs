'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, Loader2, Save } from 'lucide-react';
import { saveNavigationItem } from '@/actions/admin/navigation';

interface NavigationEditorProps {
  item: any | null;
  parentOptions: any[];
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (savedItem: any, isNew: boolean) => void;
}

export function NavigationEditor({ item, parentOptions, isOpen, onClose, onSuccess }: NavigationEditorProps) {
  const [isSaving, setIsSaving] = useState(false);
  const { register, handleSubmit, reset } = useForm();
  const isNew = !item || !item._id;

  useEffect(() => {
    if (isOpen) {
      reset(item ? {
        label: item.label,
        url: item.url,
        parentId: item.parentId || '',
      } : {
        label: '',
        url: '/',
        parentId: '',
      });
    }
  }, [item, isOpen, reset]);

  const onSubmit = async (data: any) => {
    setIsSaving(true);
    const res = await saveNavigationItem(data, item?._id);
    if (res.success) {
      onSuccess(res.item, isNew);
      onClose();
    } else {
      alert(res.error || 'Failed to save');
    }
    setIsSaving(false);
  };

  // 👇 ADDED THIS: Recursive function to build indented dropdown options
  const renderOptions = (items: any[], parentId: string | null = null, depth: number = 0): React.ReactNode[] => {
    // Find children for the current parent level
    const children = items.filter(i => (i.parentId || null) === parentId);
    let options: React.ReactNode[] = [];
    
    children.forEach(child => {
      // Create visual indent (e.g., "— ", "—— ")
      const prefix = depth > 0 ? '—'.repeat(depth) + ' ' : '';
      
      options.push(
        <option key={child._id} value={child._id} disabled={item?._id === child._id}>
          {prefix}{child.label}
        </option>
      );
      
      // Recursively fetch this child's children
      options = [...options, ...renderOptions(items, child._id, depth + 1)];
    });
    
    return options;
  };

  return (
    <div className={`fixed inset-0 z-50 flex justify-end transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm" onClick={onClose} />
      
      <div className={`relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h3 className="font-semibold text-slate-800">{isNew ? 'Add Navigation Link' : 'Edit Link'}</h3>
            <p className="text-xs text-slate-500">Configure your header menu.</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-700 rounded-full">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <form id="nav-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Display Label</label>
              <input type="text" {...register('label', { required: true })} className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm outline-none focus:border-[rgb(var(--color-primary))] focus:ring-1 focus:ring-[rgb(var(--color-primary))]" placeholder="e.g., Our Businesses" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Target URL</label>
              <input type="text" {...register('url', { required: true })} className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm outline-none focus:border-[rgb(var(--color-primary))] focus:ring-1 focus:ring-[rgb(var(--color-primary))]" placeholder="e.g., /businesses" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Parent Dropdown (Optional)</label>
              <select {...register('parentId')} className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm outline-none focus:border-[rgb(var(--color-primary))] bg-white">
                <option value="">-- None (Top Level Menu) --</option>
                {/* 👇 Call the recursive renderer here 👇 */}
                {renderOptions(parentOptions)}
              </select>
            </div>
          </form>
        </div>

        <div className="p-4 border-t border-slate-100 flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-md hover:bg-slate-50 font-medium text-sm">Cancel</button>
          <button type="submit" form="nav-form" disabled={isSaving} className="flex-1 px-4 py-2 bg-[rgb(var(--color-primary))] text-white rounded-md hover:bg-opacity-90 font-medium text-sm flex items-center justify-center gap-2">
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save
          </button>
        </div>
      </div>
    </div>
  );
}