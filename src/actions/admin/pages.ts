'use server';

import { revalidatePath } from 'next/cache';
import dbConnect from '@/lib/db';
import { Page } from '@/models/Page';
import { auth } from '@/auth';

export async function savePage(data: any, pageId?: string) {
  const session = await auth();
  if (!session || !['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)) {
    return { success: false, error: 'Unauthorized' };
  }

  await dbConnect();

  try {
    if (pageId) {
      // Update existing page
      // Prevent changing the slug of the home page to avoid breaking the root route
      if (data.slug === 'home' && pageId) {
         delete data.slug; 
      }
      const updatedPage = await Page.findByIdAndUpdate(pageId, data, { new: true }).lean();
      revalidatePath('/', 'layout');
      return { success: true, page: updatedPage };
    } else {
      // Create new page
      const existingSlug = await Page.findOne({ slug: data.slug });
      if (existingSlug) {
        return { success: false, error: 'A page with this URL slug already exists.' };
      }
      
      const newPage = await Page.create(data);
      revalidatePath('/', 'layout');
      // Convert Mongoose document to plain object for the client
      return { success: true, page: JSON.parse(JSON.stringify(newPage)) }; 
    }
  } catch (error: any) {
    console.error('Failed to save page:', error);
    return { success: false, error: 'Database update failed' };
  }
}

export async function deletePage(pageId: string) {
  const session = await auth();
  if (!session || !['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)) {
    return { success: false, error: 'Unauthorized' };
  }

  await dbConnect();

  try {
    const page = await Page.findById(pageId);
    if (page?.slug === 'home') {
      return { success: false, error: 'Cannot delete the global homepage.' };
    }

    await Page.findByIdAndDelete(pageId);
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to delete page' };
  }
}