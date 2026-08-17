'use server';

import { revalidatePath } from 'next/cache';
import dbConnect from '@/lib/db';
import { Article } from '@/models/Article';
import { auth } from '@/auth';

export async function saveArticle(data: any, articleId?: string) {
  const session = await auth();
  if (!session || !['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)) {
    return { success: false, error: 'Unauthorized' };
  }

  await dbConnect();

  try {
    if (articleId) {
      const updated = await Article.findByIdAndUpdate(articleId, data, { new: true }).lean();
      revalidatePath('/', 'layout');
      return { success: true, article: JSON.parse(JSON.stringify(updated)) };
    } else {
      const existingSlug = await Article.findOne({ slug: data.slug });
      if (existingSlug) return { success: false, error: 'URL slug already in use.' };

      const newArticle = await Article.create(data);
      revalidatePath('/', 'layout');
      return { success: true, article: JSON.parse(JSON.stringify(newArticle)) };
    }
  } catch (error) {
    console.error('Failed to save article:', error);
    return { success: false, error: 'Database update failed' };
  }
}

export async function deleteArticle(articleId: string) {
  const session = await auth();
  if (!session || !['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)) {
    return { success: false, error: 'Unauthorized' };
  }

  await dbConnect();

  try {
    await Article.findByIdAndDelete(articleId);
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to delete article' };
  }
}