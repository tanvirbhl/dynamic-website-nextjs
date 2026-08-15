'use server';

import { revalidatePath } from 'next/cache';
import dbConnect from '@/lib/db';
import { Section } from '@/models/Section';
import { auth } from '@/auth';

export async function toggleSectionVisibility(sectionId: string, isVisible: boolean) {
  // 1. Verify Authorization
  const session = await auth();
  if (!session || !['SUPER_ADMIN', 'ADMIN', 'EDITOR'].includes(session.user.role)) {
    return { success: false, error: 'Unauthorized' };
  }

  await dbConnect();
  
  try {
    // 2. Update the Database
    await Section.findByIdAndUpdate(sectionId, { isVisible });
    
    // 3. Purge the cache so the public website immediately reflects the change
    revalidatePath('/', 'layout'); 
    
    return { success: true };
  } catch (error) {
    console.error('Error toggling section visibility:', error);
    return { success: false, error: 'Failed to update visibility' };
  }
}