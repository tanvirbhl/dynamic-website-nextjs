import dbConnect from '@/lib/db';
import { Page } from '@/models/Page';
import { Section } from '@/models/Section';
import { SectionList } from '@/components/admin/SectionList';
import Link from 'next/link';
import { ArrowLeft, LayoutTemplate } from 'lucide-react';
import { notFound } from 'next/navigation';

export default async function PageBuilderRoute({ params }: { params: Promise<{ pageId: string }> }) {
  await dbConnect();
  
  // 1. Await the params Promise required in Next.js 15
  const { pageId } = await params; 

  // 2. Now use the unwrapped pageId safely
  const page = await Page.findById(pageId).lean();
  if (!page) return notFound();

  const sections = await Section.find({ pageId: page._id }).sort('sortOrder').lean();

  const serializedSections = sections.map((s: any) => ({
    ...s,
    _id: s._id.toString(),
    pageId: s.pageId.toString(),
  }));

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/pages" className="p-2 bg-white border border-slate-200 rounded-md text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <LayoutTemplate size={24} className="text-[rgb(var(--color-primary))]" />
            Builder: {page.title}
          </h1>
          <p className="text-slate-500 text-sm mt-1">Path: /{page.slug === 'home' ? '' : page.slug}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">Page Sections</h2>
            <p className="text-sm text-slate-500">Drag to reorder. Use toggles to show/hide sections instantly.</p>
          </div>
        </div>
        
        <SectionList pageId={page._id.toString()} initialSections={serializedSections} />
      </div>
    </div>
  );
}