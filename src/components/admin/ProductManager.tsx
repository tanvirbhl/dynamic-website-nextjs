'use client';

import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { ProductEditor } from './ProductEditor';
import { deleteProduct } from '@/actions/admin/products';

export function ProductManager({ initialProducts, businesses }: { initialProducts: any[], businesses: any[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    const res = await deleteProduct(id);
    if (res.success) setProducts(products.filter(p => p._id !== id));
  };

  const getBusinessName = (businessId: string) => {
    const business = businesses.find(b => b._id === businessId);
    return business ? business.name : 'Unknown Business';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Products & Brands</h1>
          <p className="text-slate-500 text-sm mt-1">Manage the portfolio of items tied to your businesses.</p>
        </div>
        <button onClick={() => { setEditingItem(null); setIsEditorOpen(true); }} className="bg-[rgb(var(--color-primary))] text-white px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2 hover:bg-opacity-90">
          <Plus size={16} /> Add Product
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-xs">
            <tr>
              <th className="px-6 py-4">Product Name</th>
              <th className="px-6 py-4">Parent Business</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map((product) => (
              <tr key={product._id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-bold text-slate-800 flex items-center gap-3">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt="product" className="w-8 h-8 rounded object-cover border border-slate-200" />
                  ) : (
                    <div className="w-8 h-8 rounded bg-slate-200 flex items-center justify-center text-xs text-slate-400">img</div>
                  )}
                  {product.name}
                </td>
                <td className="px-6 py-4 text-slate-600 font-medium">
                  {getBusinessName(product.businessId)}
                </td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${product.status === 'PUBLISHED' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-yellow-50 border-yellow-200 text-yellow-700'}`}>
                    {product.status}
                  </span>
                </td>
                <td className="px-6 py-4 flex items-center justify-end gap-2">
                  <button onClick={() => { setEditingItem(product); setIsEditorOpen(true); }} className="p-1.5 text-slate-400 hover:text-[rgb(var(--color-primary))] hover:bg-slate-100 rounded">
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => handleDelete(product._id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && <div className="p-12 text-center text-slate-500">No products added yet.</div>}
      </div>

      <ProductEditor 
        product={editingItem} 
        businesses={businesses}
        isOpen={isEditorOpen} 
        onClose={() => setIsEditorOpen(false)} 
        onSuccess={(savedItem: any, isNew: boolean) => {
          if (isNew) setProducts([...products, savedItem]);
          else setProducts(products.map(p => p._id === savedItem._id ? savedItem : p));
        }} 
      />
    </div>
  );
}