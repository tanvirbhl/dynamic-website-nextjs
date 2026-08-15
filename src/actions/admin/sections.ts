'use server';

import { revalidatePath } from 'next/cache';
import dbConnect from '@/lib/db';
import { Section } from '@/models/Section';
import { auth } from '@/auth';

export async function updateSectionContent(sectionId: string, content: any) {
  const session = await auth();
  if (!session || !['SUPER_ADMIN', 'ADMIN', 'EDITOR'].includes(session.user.role)) {
    return { success: false, error: 'Unauthorized' };
  }

  await dbConnect();

  try {
    // Update only the content object of the specific section
    await Section.findByIdAndUpdate(sectionId, { content });
    
    // Purge cache to reflect updates instantly on the public site
    revalidatePath('/', 'layout');
    
    return { success: true };
  } catch (error) {
    console.error('Failed to update section content:', error);
    return { success: false, error: 'Database update failed' };
  }
}