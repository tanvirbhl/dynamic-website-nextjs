'use client';

import { useState } from 'react';
import { Plus, Pencil, Trash2, ExternalLink } from 'lucide-react';
import { BusinessEditor } from './BusinessEditor';
import { deleteBusiness } from '@/actions/admin/businesses';
import Link from 'next/link';

export function BusinessManager({ initialBusinesses }: { initialBusinesses: any[] }) {
  const [businesses, setBusinesses] = useState(initialBusinesses);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this business?')) return;
    const res = await deleteBusiness(id);
    if (res.success) setBusinesses(businesses.filter(b => b._id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Subsidiaries & Businesses</h1>
          <p className="text-slate-500 text-sm mt-1">Manage Nova Industries corporate entities.</p>
        </div>
        <button onClick={() => { setEditingItem(null); setIsEditorOpen(true); }} className="bg-[rgb(var(--color-primary))] text-white px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2 hover:bg-opacity-90">
          <Plus size={16} /> Add Business
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-xs">
            <tr>
              <th className="px-6 py-4">Business Name</th>
              <th className="px-6 py-4">Slug</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {businesses.map((business) => (
              <tr key={business._id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-bold text-slate-800 flex items-center gap-3">
                  {business.logoUrl ? (
                    <img src={business.logoUrl} alt="logo" className="w-8 h-8 rounded-full object-cover border border-slate-200" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold">{business.name.charAt(0)}</div>
                  )}
                  {business.name}
                </td>
                <td className="px-6 py-4 text-slate-500 font-mono text-xs">/businesses/{business.slug}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${business.status === 'PUBLISHED' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-yellow-50 border-yellow-200 text-yellow-700'}`}>
                    {business.status}
                  </span>
                </td>
                <td className="px-6 py-4 flex items-center justify-end gap-2">
                  <Link href={`/businesses/${business.slug}`} target="_blank" className="p-1.5 text-slate-400 hover:text-[rgb(var(--color-primary))] hover:bg-slate-100 rounded">
                    <ExternalLink size={16} />
                  </Link>
                  <button onClick={() => { setEditingItem(business); setIsEditorOpen(true); }} className="p-1.5 text-slate-400 hover:text-[rgb(var(--color-primary))] hover:bg-slate-100 rounded">
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => handleDelete(business._id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {businesses.length === 0 && <div className="p-12 text-center text-slate-500">No businesses added yet.</div>}
      </div>

      <BusinessEditor 
        business={editingItem} 
        isOpen={isEditorOpen} 
        onClose={() => setIsEditorOpen(false)} 
        onSuccess={(savedItem: any, isNew: boolean) => {
          if (isNew) setBusinesses([...businesses, savedItem]);
          else setBusinesses(businesses.map(b => b._id === savedItem._id ? savedItem : b));
        }} 
      />
    </div>
  );
}