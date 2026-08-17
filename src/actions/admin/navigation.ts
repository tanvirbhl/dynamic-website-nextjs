'use server';

import { revalidatePath } from 'next/cache';
import dbConnect from '@/lib/db';
import { Navigation } from '@/models/Navigation';
import { auth } from '@/auth';

export async function saveNavigationItem(data: any, itemId?: string) {
  const session = await auth();
  if (!session || !['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)) {
    return { success: false, error: 'Unauthorized' };
  }

  await dbConnect();

  try {
    // Convert empty string to null for top-level items
    const payload = {
      ...data,
      parentId: data.parentId ? data.parentId : null,
    };

    if (itemId) {
      const updated = await Navigation.findByIdAndUpdate(itemId, payload, { new: true }).lean();
      revalidatePath('/', 'layout');
      return { success: true, item: JSON.parse(JSON.stringify(updated)) };
    } else {
      const currentCount = await Navigation.countDocuments({ parentId: payload.parentId });
      payload.sortOrder = currentCount + 1;
      
      const newItem = await Navigation.create(payload);
      revalidatePath('/', 'layout');
      return { success: true, item: JSON.parse(JSON.stringify(newItem)) };
    }
  } catch (error) {
    console.error('Failed to save navigation:', error);
    return { success: false, error: 'Database update failed' };
  }
}

export async function deleteNavigationItem(itemId: string) {
  const session = await auth();
  if (!session || !['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)) {
    return { success: false, error: 'Unauthorized' };
  }

  await dbConnect();

  try {
    // Delete the item and any child items nested inside it
    await Navigation.findByIdAndDelete(itemId);
    await Navigation.deleteMany({ parentId: itemId });
    
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to delete navigation item' };
  }
}

export async function toggleNavigationVisibility(itemId: string, isVisible: boolean) {
  const session = await auth();
  if (!session || !['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)) return { success: false };

  await dbConnect();
  try {
    await Navigation.findByIdAndUpdate(itemId, { isVisible });
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}