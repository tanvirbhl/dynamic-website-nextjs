"use client";

import { useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  LayoutTemplate,
} from "lucide-react";
import { PageEditor } from "./PageEditor";
import { deletePage } from "@/actions/admin/pages";
import Link from "next/link";

export function PageManager({ initialPages }: { initialPages: any[] }) {
  const [pages, setPages] = useState(initialPages);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<any | null>(null);

  const openCreator = () => {
    setEditingPage(null);
    setIsEditorOpen(true);
  };

  const openEditor = (page: any) => {
    setEditingPage(page);
    setIsEditorOpen(true);
  };

  const handleDelete = async (id: string, slug: string) => {
    if (slug === "home") return alert("Cannot delete the homepage.");
    if (
      !confirm(
        "Are you sure you want to delete this page? This action cannot be undone.",
      )
    )
      return;

    const res = await deletePage(id);
    if (res.success) {
      setPages(pages.filter((p) => p._id !== id));
    } else {
      alert(res.error || "Failed to delete page");
    }
  };

  const handleEditorSuccess = (savedPage: any, isNew: boolean) => {
    if (isNew) {
      setPages([...pages, savedPage]);
    } else {
      setPages(pages.map((p) => (p._id === savedPage._id ? savedPage : p)));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Website Pages</h1>
          <p className="text-slate-500 text-sm mt-1">
            Create and manage your public routes and SEO metadata.
          </p>
        </div>
        <button
          onClick={openCreator}
          className="bg-[rgb(var(--color-primary))] hover:bg-opacity-90 text-white px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus size={16} />
          Create New Page
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-xs tracking-wider">
            <tr>
              <th className="px-6 py-4">Page Title</th>
              <th className="px-6 py-4">URL Slug</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {pages.map((page) => (
              <tr
                key={page._id}
                className="hover:bg-slate-50/50 transition-colors"
              >
                <td className="px-6 py-4 font-medium text-slate-800">
                  {page.title}
                </td>
                <td className="px-6 py-4 text-slate-500 font-mono text-xs">
                  /{page.slug === "home" ? "" : page.slug}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                      page.status === "PUBLISHED"
                        ? "bg-green-50 border-green-200 text-green-700"
                        : "bg-yellow-50 border-yellow-200 text-yellow-700"
                    }`}
                  >
                    {page.status}
                  </span>
                </td>
                <td className="px-6 py-4 flex items-center justify-end gap-2">
                  <Link
                    href={`/admin/pages/${page._id}`}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                    title="Open Page Builder"
                  >
                    <LayoutTemplate size={16} />
                  </Link>
                  <button
                    onClick={() => openEditor(page)}
                    className="p-1.5 text-slate-400 hover:text-[rgb(var(--color-primary))] hover:bg-slate-100 rounded transition-colors"
                    title="Edit Settings"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(page._id, page.slug)}
                    disabled={page.slug === "home"}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400 rounded transition-colors"
                    title="Delete Page"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {pages.length === 0 && (
          <div className="px-6 py-12 text-center text-slate-500">
            No pages found. Click "Create New Page" to get started.
          </div>
        )}
      </div>

      <PageEditor
        page={editingPage}
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSuccess={handleEditorSuccess}
      />
    </div>
  );
}
