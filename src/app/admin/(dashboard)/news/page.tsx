import dbConnect from '@/lib/db';
import { Article } from '@/models/Article';
import { ArticleManager } from '@/components/admin/ArticleManager';

export const metadata = { title: 'Manage News & Events | Nova CMS' };

export default async function AdminNewsRoute() {
  await dbConnect();
  
  // Fetch all articles, sorting by newest publish date first
  const rawArticles = await Article.find().sort({ publishDate: -1 }).lean();
  
  const articles = rawArticles.map((a: any) => ({
    ...a,
    _id: a._id.toString(),
    publishDate: a.publishDate.toISOString(), // Serialize date for client component
  }));

  return (
    <div className="max-w-6xl mx-auto">
      <ArticleManager initialArticles={articles} />
    </div>
  );
}