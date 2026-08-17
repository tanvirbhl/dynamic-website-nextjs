import dbConnect from '@/lib/db';
import { Product } from '@/models/Product';
import { Business } from '@/models/Business';
import { ProductManager } from '@/components/admin/ProductManager';

export const metadata = { title: 'Manage Products | Nova CMS' };

export default async function AdminProductsRoute() {
  await dbConnect();
  
  // Fetch products
  const rawProducts = await Product.find().sort('sortOrder').lean();
  const products = rawProducts.map((p: any) => ({
    ...p,
    _id: p._id.toString(),
    businessId: p.businessId.toString(),
  }));

  // Fetch businesses (only id and name needed for the dropdown)
  const rawBusinesses = await Business.find().select('name _id').lean();
  const businesses = rawBusinesses.map((b: any) => ({
    _id: b._id.toString(),
    name: b.name,
  }));

  return (
    <div className="max-w-6xl mx-auto">
      <ProductManager initialProducts={products} businesses={businesses} />
    </div>
  );
}