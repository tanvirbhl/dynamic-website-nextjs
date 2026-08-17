import dbConnect from '@/lib/db';
import { Navigation } from '@/models/Navigation';
import { NavigationManager } from '@/components/admin/NavigationManager';

export const metadata = { title: 'Navigation Manager | Nova CMS' };

export default async function AdminNavigationRoute() {
  await dbConnect();
  
  // Fetch all navigation items
  const rawItems = await Navigation.find().sort('sortOrder').lean();
  const items = rawItems.map((item: any) => ({
    ...item,
    _id: item._id.toString(),
    parentId: item.parentId ? item.parentId.toString() : null,
  }));

  return (
    <div className="max-w-5xl mx-auto">
      <NavigationManager initialItems={items} />
    </div>
  );
}