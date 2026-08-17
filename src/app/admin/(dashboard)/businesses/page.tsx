import dbConnect from '@/lib/db';
import { Business } from '@/models/Business';
import { BusinessManager } from '@/components/admin/BusinessManager';

export const metadata = { title: 'Manage Businesses | Nova CMS' };

export default async function AdminBusinessesRoute() {
  await dbConnect();
  
  const rawBusinesses = await Business.find().sort('sortOrder').lean();
  
  const businesses = rawBusinesses.map((b: any) => ({
    ...b,
    _id: b._id.toString(),
  }));

  return (
    <div className="max-w-6xl mx-auto">
      <BusinessManager initialBusinesses={businesses} />
    </div>
  );
}