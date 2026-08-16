import dbConnect from '@/lib/db';
import { Page } from '@/models/Page';
import { PageManager } from '@/components/admin/PageManager';

export const metadata = {
  title: 'Manage Pages | Nova CMS',
};

export default async function AdminPagesRoute() {
  await dbConnect();
  
  // Fetch all pages, sorting the home page to the top, then alphabetically by title
  const rawPages = await Page.find().lean();
  
  const pages = rawPages.map((page: any) => ({
    ...page,
    _id: page._id.toString(),
  })).sort((a: any, b: any) => {
    if (a.slug === 'home') return -1;
    if (b.slug === 'home') return 1;
    return a.title.localeCompare(b.title);
  });

  return (
    <div className="max-w-6xl mx-auto">
      <PageManager initialPages={pages} />
    </div>
  );
}