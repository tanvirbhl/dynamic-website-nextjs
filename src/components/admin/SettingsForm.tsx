'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Loader2, Save, Settings2 } from 'lucide-react';
import { updateGlobalSettings } from '@/actions/admin/settings';
import { ImageUploadField } from './ImageUploadField';

export function SettingsForm({ initialSettings }: { initialSettings: any }) {
  const [isSaving, setIsSaving] = useState(false);
  const { register, handleSubmit, control, formState: { isDirty } } = useForm({
    defaultValues: initialSettings
  });

  const onSubmit = async (data: any) => {
    setIsSaving(true);
    const res = await updateGlobalSettings(data);
    if (res.success) {
      alert('Global settings updated successfully!');
    } else {
      alert(res.error || 'Failed to update settings');
    }
    setIsSaving(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Settings2 className="text-[rgb(var(--color-primary))]" />
          Global Settings
        </h1>
        <p className="text-slate-500 text-sm mt-1">Manage your brand identity, logo, and site-wide configurations.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-8 space-y-8">
          
          {/* Brand Identity Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">Brand Identity</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Company / Brand Name</label>
                <input 
                  type="text" 
                  {...register('brandName', { required: true })} 
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-md text-sm outline-none focus:border-[rgb(var(--color-primary))] focus:ring-1 focus:ring-[rgb(var(--color-primary))] transition-all" 
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Contact Email</label>
                <input 
                  type="email" 
                  {...register('contactEmail')} 
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-md text-sm outline-none focus:border-[rgb(var(--color-primary))] focus:ring-1 focus:ring-[rgb(var(--color-primary))] transition-all" 
                />
              </div>
            </div>

            <div className="pt-4 max-w-md">
              <Controller
                name="logoUrl"
                control={control}
                render={({ field }) => (
                  <ImageUploadField 
                    label="Primary Logo (Cloudinary)" 
                    value={field.value} 
                    onChange={field.onChange} 
                  />
                )}
              />
            </div>
          </div>

          {/* Footer Section */}
          <div className="space-y-4 pt-4">
            <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">Footer Configuration</h3>
            
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Copyright Text</label>
              <input 
                type="text" 
                {...register('footerText')} 
                placeholder="Use {year} to dynamically insert the current year"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-md text-sm outline-none focus:border-[rgb(var(--color-primary))] focus:ring-1 focus:ring-[rgb(var(--color-primary))] transition-all" 
              />
              <p className="text-xs text-slate-500 mt-1">Example: © {'{year}'} My Company. All rights reserved.</p>
            </div>
          </div>

        </div>

        <div className="px-8 py-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button 
            type="submit" 
            disabled={isSaving || !isDirty}
            className="px-6 py-2.5 bg-[rgb(var(--color-primary))] text-white rounded-md hover:bg-opacity-90 disabled:opacity-50 transition-all font-medium flex items-center gap-2"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}