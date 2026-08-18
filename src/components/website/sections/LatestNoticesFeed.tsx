import dbConnect from '@/lib/db';
import { Article } from '@/models/Article';
import Link from 'next/link';
import { FileText, Download, ArrowRight } from 'lucide-react';

export async function LatestNoticesFeed({ limit = 3 }: { limit?: number }) {
  await dbConnect();
  
  // Fetch only PUBLISHED posts of type NOTICE, newest first
  const notices = await Article.find({ type: 'NOTICE', status: 'PUBLISHED' })
    .sort({ publishDate: -1 })
    .limit(limit)
    .lean();

  if (notices.length === 0) return null; // Hide the section if there are no notices

  return (
    <section className="py-16 bg-slate-50 border-y border-slate-200">
      <div className="max-w-5xl mx-auto px-6">
        
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Official Notices</h2>
            <p className="text-slate-600 mt-2">The latest announcements and downloadable documents.</p>
          </div>
          <Link href="/news" className="text-[rgb(var(--color-primary))] font-medium hover:underline hidden md:flex items-center gap-1">
            View All <ArrowRight size={16} />
          </Link>
        </div>
        
        <div className="space-y-4">
          {notices.map((notice: any) => (
            <div key={notice._id.toString()} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition-shadow">
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600 shrink-0">
                  <FileText size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">{notice.title}</h3>
                  <p className="text-sm text-slate-500">{new Date(notice.publishDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Link href={`/news/${notice.slug}`} className="px-4 py-2 border border-slate-200 text-slate-700 rounded-md text-sm font-medium hover:bg-slate-50 transition-colors">
                  Details
                </Link>
                {notice.documentUrl && (
                  <a href={notice.documentUrl} target="_blank" className="px-4 py-2 bg-slate-900 text-white rounded-md text-sm font-medium hover:bg-opacity-90 flex items-center gap-2 transition-colors">
                    <Download size={16} /> PDF
                  </a>
                )}
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}