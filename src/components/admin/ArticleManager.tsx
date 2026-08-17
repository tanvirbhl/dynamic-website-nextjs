'use client';

import { useState } from 'react';
import { Plus, Pencil, Trash2, ExternalLink, FileText } from 'lucide-react';
import { ArticleEditor } from './ArticleEditor';
import { deleteArticle } from '@/actions/admin/articles';
import Link from 'next/link';

export function ArticleManager({ initialArticles }: { initialArticles: any[] }) {
  const [articles, setArticles] = useState(initialArticles);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    const res = await deleteArticle(id);
    if (res.success) setArticles(articles.filter(a => a._id !== id));
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'NEWS': return 'bg-blue-50 border-blue-200 text-blue-700';
      case 'EVENT': return 'bg-purple-50 border-purple-200 text-purple-700';
      case 'NOTICE': return 'bg-amber-50 border-amber-200 text-amber-700';
      default: return 'bg-slate-50 border-slate-200 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">News, Events & Notices</h1>
          <p className="text-slate-500 text-sm mt-1">Manage all your published announcements and documents.</p>
        </div>
        <button onClick={() => { setEditingItem(null); setIsEditorOpen(true); }} className="bg-[rgb(var(--color-primary))] text-white px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2 hover:bg-opacity-90 transition-all shadow-sm">
          <Plus size={16} /> Create Post
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-xs">
            <tr>
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Publish Date</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {articles.map((article) => (
              <tr key={article._id} className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {article.coverImageUrl ? (
                      <img src={article.coverImageUrl} alt="" className="w-10 h-10 rounded object-cover border border-slate-200 shrink-0" />
                    ) : (
                      <div className="w-10 h-10 rounded bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                        <FileText size={18} />
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-slate-800 line-clamp-1">{article.title}</p>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">/news/{article.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${getTypeColor(article.type)}`}>
                    {article.type}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${article.status === 'PUBLISHED' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-slate-100 border-slate-200 text-slate-500'}`}>
                    {article.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-600 whitespace-nowrap">
                  {new Date(article.publishDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </td>
                <td className="px-6 py-4 flex items-center justify-end gap-2">
                  <Link href={`/news/${article.slug}`} target="_blank" className="p-1.5 text-slate-400 hover:text-[rgb(var(--color-primary))] hover:bg-slate-100 rounded transition-colors">
                    <ExternalLink size={16} />
                  </Link>
                  <button onClick={() => { setEditingItem(article); setIsEditorOpen(true); }} className="p-1.5 text-slate-400 hover:text-[rgb(var(--color-primary))] hover:bg-slate-100 rounded transition-colors">
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => handleDelete(article._id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {articles.length === 0 && (
          <div className="p-12 text-center text-slate-500">
            No posts created yet. Click "Create Post" to get started.
          </div>
        )}
      </div>

      {/* The Slide-Out Drawer */}
      <ArticleEditor 
        article={editingItem} 
        isOpen={isEditorOpen} 
        onClose={() => setIsEditorOpen(false)} 
        onSuccess={(savedItem: any, isNew: boolean) => {
          if (isNew) {
            // Add to top of list and sort by date
            setArticles([savedItem, ...articles].sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()));
          } else {
            setArticles(articles.map(a => a._id === savedItem._id ? savedItem : a).sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()));
          }
        }} 
      />
    </div>
  );
}