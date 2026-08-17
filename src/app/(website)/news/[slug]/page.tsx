import dbConnect from '@/lib/db';
import { Article } from '@/models/Article';
import { notFound } from 'next/navigation';
import { FileText, Download, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await dbConnect();
  
  const article = await Article.findOne({ slug, status: 'PUBLISHED' }).lean();
  if (!article) return notFound();

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <Link href="/news" className="inline-flex items-center gap-2 text-sm font-medium text-[rgb(var(--color-primary))] hover:underline mb-8">
        <ArrowLeft size={16} /> Back to Feed
      </Link>

      {(article as any).coverImageUrl && (
        <img src={(article as any).coverImageUrl} alt="" className="w-full h-64 object-cover rounded-2xl mb-8" />
      )}

      <div className="mb-6">
        <span className="text-sm font-bold text-[rgb(var(--color-primary))] uppercase tracking-wider">{(article as any).type}</span>
        <h1 className="text-4xl font-bold text-slate-900 mt-2">{(article as any).title}</h1>
        <p className="text-slate-400 mt-2">{new Date((article as any).publishDate).toLocaleDateString()}</p>
      </div>

      <div className="prose prose-slate max-w-none text-lg leading-relaxed text-slate-700 whitespace-pre-wrap">
        {(article as any).content}
      </div>

      {/* PDF Download Button for Notices */}
      {(article as any).type === 'NOTICE' && (article as any).documentUrl && (
        <div className="mt-12 p-6 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <FileText className="text-[rgb(var(--color-primary))]" size={32} />
            <div>
              <h4 className="font-bold text-slate-900">Official Document</h4>
              <p className="text-sm text-slate-500">Download the PDF notice for more details.</p>
            </div>
          </div>
          <a href={(article as any).documentUrl} target="_blank" className="bg-slate-900 text-white px-5 py-2.5 rounded-md font-medium flex items-center gap-2 hover:bg-opacity-90">
            <Download size={18} /> Download PDF
          </a>
        </div>
      )}
    </div>
  );
}