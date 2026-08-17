'use server';

import { revalidatePath } from 'next/cache';
import dbConnect from '@/lib/db';
import { Product } from '@/models/Product';
import { auth } from '@/auth';

export async function saveProduct(data: any, productId?: string) {
  const session = await auth();
  if (!session || !['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)) {
    return { success: false, error: 'Unauthorized' };
  }

  await dbConnect();

  try {
    // Convert comma-separated features into an array of strings
    if (typeof data.features === 'string') {
      data.features = data.features.split(',').map((f: string) => f.trim()).filter((f: string) => f);
    }

    if (productId) {
      const updated = await Product.findByIdAndUpdate(productId, data, { new: true }).lean();
      revalidatePath('/', 'layout');
      return { success: true, product: JSON.parse(JSON.stringify(updated)) };
    } else {
      const existingSlug = await Product.findOne({ slug: data.slug });
      if (existingSlug) return { success: false, error: 'URL slug already in use.' };

      const currentCount = await Product.countDocuments({ businessId: data.businessId });
      const newProduct = await Product.create({ ...data, sortOrder: currentCount + 1 });
      revalidatePath('/', 'layout');
      return { success: true, product: JSON.parse(JSON.stringify(newProduct)) };
    }
  } catch (error) {
    console.error('Failed to save product:', error);
    return { success: false, error: 'Database update failed' };
  }
}

export async function deleteProduct(productId: string) {
  const session = await auth();
  if (!session || !['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)) {
    return { success: false, error: 'Unauthorized' };
  }

  await dbConnect();

  try {
    await Product.findByIdAndDelete(productId);
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to delete product' };
  }
}