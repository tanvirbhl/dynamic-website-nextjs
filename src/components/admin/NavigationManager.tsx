'use client';
import React, { useState } from 'react';
import { Plus, Pencil, Trash2, CornerDownRight } from 'lucide-react';
import { NavigationEditor } from './NavigationEditor';
import { deleteNavigationItem } from '@/actions/admin/navigation';
import { ActiveToggle } from './ActiveToggle';

// 1. Recursive Row Component
const RecursiveNavRow = ({ item, allItems, depth = 0, onEdit, onDelete }: any) => {
  // Find all items that claim THIS item as their parent
  const children = allItems.filter((i: any) => i.parentId === item._id);

  return (
    <React.Fragment>
      <tr className={depth === 0 ? "hover:bg-slate-50" : "bg-slate-50/50 hover:bg-slate-50"}>
        {/* Dynamic Padding based on depth level */}
        <td 
          className={`px-6 py-4 flex items-center gap-2 ${depth === 0 ? 'font-bold text-slate-800' : 'text-slate-600'}`}
          style={{ paddingLeft: `${(depth * 2) + 1.5}rem` }}
        >
          {depth > 0 && <CornerDownRight size={14} className="text-slate-400 shrink-0" />}
          {item.label}
        </td>
        
        <td className="px-6 py-4 text-slate-500 font-mono text-xs">{item.url}</td>
        
        <td className="px-6 py-4">
          {depth === 0 ? (
            <ActiveToggle id={item._id} initialStatus={item.isVisible} />
          ) : (
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${item.isVisible ? 'bg-green-50 border-green-200 text-green-700' : 'bg-slate-100 border-slate-200 text-slate-500'}`}>
              {item.isVisible ? 'ACTIVE' : 'HIDDEN'}
            </span>
          )}
        </td>
        
        <td className="px-6 py-4 flex items-center justify-end gap-2">
          <button onClick={() => onEdit(item)} className="p-1.5 text-slate-400 hover:text-[rgb(var(--color-primary))] hover:bg-slate-100 rounded">
            <Pencil size={16} />
          </button>
          <button onClick={() => onDelete(item._id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded">
            <Trash2 size={16} />
          </button>
        </td>
      </tr>
      
      {/* 2. The Magic: If this item has children, render THIS SAME component again! */}
      {children.map((child: any) => (
        <RecursiveNavRow 
          key={child._id} 
          item={child} 
          allItems={allItems} 
          depth={depth + 1} 
          onEdit={onEdit} 
          onDelete={onDelete} 
        />
      ))}
    </React.Fragment>
  );
};

export function NavigationManager({ initialItems }: { initialItems: any[] }) {
  const [items, setItems] = useState(initialItems);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);

  // Only start the chain with items that have NO parent
  const topLevelItems = items.filter(i => !i.parentId);
  
  // Helper to find all nested children IDs so we can delete them locally
  const getAllDescendantIds = (parentId: string, allItems: any[]): string[] => {
    const children = allItems.filter(i => i.parentId === parentId);
    let ids = children.map(c => c._id);
    children.forEach(c => {
      ids = [...ids, ...getAllDescendantIds(c._id, allItems)];
    });
    return ids;
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this link? All nested sub-links inside it will also be deleted.')) return;
    const res = await deleteNavigationItem(id);
    if (res.success) {
      const idsToRemove = [id, ...getAllDescendantIds(id, items)];
      setItems(items.filter(i => !idsToRemove.includes(i._id)));
    }
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
              <RecursiveNavRow 
                key={parent._id} 
                item={parent} 
                allItems={items} 
                depth={0} 
                onEdit={(item: any) => { setEditingItem(item); setIsEditorOpen(true); }}
                onDelete={handleDelete}
              />
            ))}
          </tbody>
        </table>
        {items.length === 0 && <div className="p-12 text-center text-slate-500">No navigation items configured.</div>}
      </div>

      <NavigationEditor 
        item={editingItem} 
        // 3. IMPORTANT TWEAK: Pass ALL items to the editor so you can select a child as a parent!
        parentOptions={items} 
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