'use server';

import { revalidatePath } from 'next/cache';
import dbConnect from '@/lib/db';
import { Business } from '@/models/Business';
import { auth } from '@/auth';

export async function saveBusiness(data: any, businessId?: string) {
  const session = await auth();
  if (!session || !['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)) {
    return { success: false, error: 'Unauthorized' };
  }

  await dbConnect();

  try {
    if (businessId) {
      const updated = await Business.findByIdAndUpdate(businessId, data, { new: true }).lean();
      revalidatePath('/', 'layout');
      return { success: true, business: JSON.parse(JSON.stringify(updated)) };
    } else {
      const existingSlug = await Business.findOne({ slug: data.slug });
      if (existingSlug) return { success: false, error: 'URL slug already in use.' };

      const currentCount = await Business.countDocuments();
      const newBusiness = await Business.create({ ...data, sortOrder: currentCount + 1 });
      revalidatePath('/', 'layout');
      return { success: true, business: JSON.parse(JSON.stringify(newBusiness)) };
    }
  } catch (error) {
    console.error('Failed to save business:', error);
    return { success: false, error: 'Database update failed' };
  }
}

export async function deleteBusiness(businessId: string) {
  const session = await auth();
  if (!session || !['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)) {
    return { success: false, error: 'Unauthorized' };
  }

  await dbConnect();

  try {
    await Business.findByIdAndDelete(businessId);
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to delete business' };
  }
}