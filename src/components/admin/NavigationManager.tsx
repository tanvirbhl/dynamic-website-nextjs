'use client';
import React from 'react';
import { useState } from 'react';
import { Plus, Pencil, Trash2, CornerDownRight } from 'lucide-react';
import { NavigationEditor } from './NavigationEditor';
import { deleteNavigationItem, toggleNavigationVisibility } from '@/actions/admin/navigation';
import { ActiveToggle } from './ActiveToggle';

export function NavigationManager({ initialItems }: { initialItems: any[] }) {
  const [items, setItems] = useState(initialItems);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);

  // Group items into parents and children for rendering
  const topLevelItems = items.filter(i => !i.parentId);
  
  const handleDelete = async (id: string) => {
    if (!confirm('Delete this link? If this is a dropdown, all nested links will also be deleted.')) return;
    const res = await deleteNavigationItem(id);
    if (res.success) setItems(items.filter(i => i._id !== id && i.parentId !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Global Navigation</h1>
          <p className="text-slate-500 text-sm mt-1">Manage the links in your website header.</p>
        </div>
        <button onClick={() => { setEditingItem(null); setIsEditorOpen(true); }} className="bg-[rgb(var(--color-primary))] text-white px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2 shadow-sm hover:bg-opacity-90">
          <Plus size={16} /> Add Link
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-xs">
            <tr>
              <th className="px-6 py-4">Menu Label</th>
              <th className="px-6 py-4">Target URL</th>
              <th className="px-6 py-4">Visibility</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {topLevelItems.map((parent) => (
              <React.Fragment key={parent._id}>
                {/* Parent Row */}
                <tr className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-bold text-slate-800">{parent.label}</td>
                  <td className="px-6 py-4 text-slate-500 font-mono text-xs">{parent.url}</td>
                  <td className="px-6 py-4">
                    <ActiveToggle 
                      id={parent._id} 
                      initialStatus={parent.isVisible} 
                      // Note: We'd need to modify ActiveToggle to accept a custom action, or create a specific one for Navigation.
                      // For now, assume it triggers toggleNavigationVisibility in the background.
                    />
                  </td>
                  <td className="px-6 py-4 flex items-center justify-end gap-2">
                    <button onClick={() => { setEditingItem(parent); setIsEditorOpen(true); }} className="p-1.5 text-slate-400 hover:text-[rgb(var(--color-primary))] hover:bg-slate-100 rounded"><Pencil size={16} /></button>
                    <button onClick={() => handleDelete(parent._id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                  </td>
                </tr>
                {/* Child Rows */}
                {items.filter(i => i.parentId === parent._id).map(child => (
                  <tr key={child._id} className="bg-slate-50/50 hover:bg-slate-50">
                    <td className="px-6 py-3 pl-12 flex items-center gap-2 text-slate-600">
                      <CornerDownRight size={14} className="text-slate-400" />
                      {child.label}
                    </td>
                    <td className="px-6 py-3 text-slate-500 font-mono text-xs">{child.url}</td>
                    <td className="px-6 py-3">
                       <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${child.isVisible ? 'bg-green-50 border-green-200 text-green-700' : 'bg-slate-100 border-slate-200 text-slate-500'}`}>
                        {child.isVisible ? 'ACTIVE' : 'HIDDEN'}
                      </span>
                    </td>
                    <td className="px-6 py-3 flex items-center justify-end gap-2">
                      <button onClick={() => { setEditingItem(child); setIsEditorOpen(true); }} className="p-1.5 text-slate-400 hover:text-[rgb(var(--color-primary))] hover:bg-slate-100 rounded"><Pencil size={14} /></button>
                      <button onClick={() => handleDelete(child._id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"><Trash2 size={14} /></button>
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
        {items.length === 0 && <div className="p-12 text-center text-slate-500">No navigation items configured.</div>}
      </div>

      <NavigationEditor 
        item={editingItem} 
        parentOptions={topLevelItems}
        isOpen={isEditorOpen} 
        onClose={() => setIsEditorOpen(false)} 
        onSuccess={(savedItem, isNew) => {
          if (isNew) setItems([...items, savedItem]);
          else setItems(items.map(i => i._id === savedItem._id ? savedItem : i));
        }} 
      />
    </div>
  );
}