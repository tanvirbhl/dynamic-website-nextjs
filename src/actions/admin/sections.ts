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




export async function createSection(pageId: string, type: 'hero' | 'about') {
  const session = await auth();
  if (!session || !['SUPER_ADMIN', 'ADMIN', 'EDITOR'].includes(session.user.role)) {
    return { success: false, error: 'Unauthorized' };
  }

  await dbConnect();

  try {
    const currentCount = await Section.countDocuments({ pageId });
    
    // Create default skeleton content based on the type
    const defaultContent = type === 'hero' 
      ? { title: 'New Hero Section', subtitle: '', button1: '', button1Url: '' } 
      : { heading: 'New About Section', description: '', button: '', buttonUrl: '' };

    const newSection = await Section.create({
      pageId,
      type,
      sortOrder: currentCount + 1,
      content: defaultContent,
      isVisible: false // Default to hidden so you can edit before public release
    });

    revalidatePath('/', 'layout');
    return { success: true, section: JSON.parse(JSON.stringify(newSection)) };
  } catch (error) {
    console.error('Failed to create section:', error);
    return { success: false, error: 'Database creation failed' };
  }
}

export async function deleteSection(sectionId: string) {
  const session = await auth();
  if (!session || !['SUPER_ADMIN', 'ADMIN', 'EDITOR'].includes(session.user.role)) {
    return { success: false, error: 'Unauthorized' };
  }

  await dbConnect();

  try {
    await Section.findByIdAndDelete(sectionId);
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to delete section' };
  }
}