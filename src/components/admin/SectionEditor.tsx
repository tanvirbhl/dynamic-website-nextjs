'use client';

import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form'; // <-- Added Controller
import { X, Loader2, Save, Trash2 } from 'lucide-react';
import { updateSectionContent } from '@/actions/admin/sections';
import { ImageUploadField } from './ImageUploadField'; // <-- Import our new widget

interface SectionEditorProps {
  section: any | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedSection: any) => void;
  onDelete: (sectionId: string) => void;
}

export function SectionEditor({ section, isOpen, onClose, onSuccess, onDelete }: SectionEditorProps) {
  const [isSaving, setIsSaving] = useState(false);
  const { register, handleSubmit, control, reset, formState: { isDirty } } = useForm();

  useEffect(() => {
    if (section && section.content) {
      reset(section.content);
    }
  }, [section, reset]);

  const onSubmit = async (data: any) => {
    if (!section) return;
    setIsSaving(true);
    
    const res = await updateSectionContent(section._id, data);
    
    if (res.success) {
      onSuccess({ ...section, content: data });
      onClose();
    } else {
      alert(res.error || 'Failed to save content');
    }
    
    setIsSaving(false);
  };

  if (!section) return null;

  return (
    <div className={`fixed inset-0 z-50 flex justify-end transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm" onClick={onClose} />
      
      <div className={`relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h3 className="font-semibold text-slate-800 capitalize">Edit {section.type}</h3>
            <p className="text-xs text-slate-500">Update content and save to publish.</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-700 rounded-full transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <form id="section-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            
            {section.type === 'hero' && (
              <>
                <Field label="Hero Title" name="title" register={register} />
                <Field label="Subtitle" name="subtitle" type="textarea" register={register} />
                
                {/* Cloudinary Image Upload Field */}
                <Controller
                  name="backgroundImage"
                  control={control}
                  render={({ field }) => (
                    <ImageUploadField 
                      label="Background Image" 
                      value={field.value} 
                      onChange={field.onChange} 
                    />
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <Field label="Button 1 Text" name="button1" register={register} />
                  <Field label="Button 1 URL" name="button1Url" register={register} />
                  <Field label="Button 2 Text" name="button2" register={register} />
                  <Field label="Button 2 URL" name="button2Url" register={register} />
                </div>
              </>
            )}

            {section.type === 'about' && (
              <>
                <Field label="Heading" name="heading" register={register} />
                <Field label="Description" name="description" type="textarea" register={register} />
                
                {/* Cloudinary Image Upload Field */}
                <Controller
                  name="image"
                  control={control}
                  render={({ field }) => (
                    <ImageUploadField 
                      label="Side Image" 
                      value={field.value} 
                      onChange={field.onChange} 
                    />
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <Field label="Button Text" name="button" register={register} />
                  <Field label="Button URL" name="buttonUrl" register={register} />
                </div>
              </>
            )}
            {section.type === 'RECENT_NOTICES' && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm">
                <p className="font-bold mb-1">Dynamic Feed</p>
                <p>This section automatically fetches and displays the latest published notices from your database. No manual text or image configuration is required here!</p>
              </div>
            )}

          </form>
        </div>

        {/* Replace the old footer with this updated one */}
        <div className="p-4 border-t border-slate-100 bg-white flex gap-3">
          <button 
            type="button" 
            onClick={() => {
              if(confirm('Are you sure you want to delete this section?')) onDelete(section._id);
            }} 
            className="px-4 py-2 border border-red-100 text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors font-medium text-sm"
            title="Delete Section"
          >
           
            <Trash2 size={16} />
          </button>
          <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-md hover:bg-slate-50 transition-colors font-medium text-sm">
            Cancel
          </button>
          <button 
            type="submit" 
            form="section-form" 
            disabled={isSaving}
            className="flex-1 px-4 py-2 bg-[rgb(var(--color-primary))] text-white rounded-md hover:bg-opacity-90 disabled:opacity-50 transition-all font-medium text-sm flex items-center justify-center gap-2"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, name, type = 'text', register }: any) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">{label}</label>
      {type === 'textarea' ? (
        <textarea {...register(name)} rows={3} className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm outline-none focus:border-[rgb(var(--color-primary))] focus:ring-1 focus:ring-[rgb(var(--color-primary))] transition-all resize-none" />
      ) : (
        <input type="text" {...register(name)} className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm outline-none focus:border-[rgb(var(--color-primary))] focus:ring-1 focus:ring-[rgb(var(--color-primary))] transition-all" />
      )}
    </div>
  );
}