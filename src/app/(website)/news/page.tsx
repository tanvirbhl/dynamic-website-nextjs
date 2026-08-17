import dbConnect from '@/lib/db';
import { Article } from '@/models/Article';
import Link from 'next/link';
import { FileText, Calendar } from 'lucide-react';

export default async function NewsPage() {
  await dbConnect();
  const articles = await Article.find({ status: 'PUBLISHED' }).sort({ publishDate: -1 }).lean();

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold text-slate-900 mb-12">News, Events & Notices</h1>
      
      <div className="space-y-6">
        {articles.map((article: any) => (
          <Link href={`/news/${article.slug}`} key={article._id.toString()} className="block bg-white p-6 rounded-xl border border-slate-200 hover:shadow-md transition-all flex gap-6">
            {article.coverImageUrl && (
              <img src={article.coverImageUrl} alt="" className="w-32 h-32 rounded-lg object-cover" />
            )}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[rgb(var(--color-primary))] bg-indigo-50 px-2 py-1 rounded">
                  {article.type}
                </span>
                <span className="text-sm text-slate-400 flex items-center gap-1">
                  <Calendar size={14} /> {new Date(article.publishDate).toLocaleDateString()}
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2 hover:text-[rgb(var(--color-primary))] transition-colors">
                {article.title}
              </h2>
              <p className="text-slate-600 line-clamp-2">{article.content}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}