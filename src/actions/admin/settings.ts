'use server';

import { revalidatePath } from 'next/cache';
import dbConnect from '@/lib/db';
import { Settings } from '@/models/Settings';
import { auth } from '@/auth';

// Fetch settings (and create default if they don't exist yet)
export async function getGlobalSettings() {
  await dbConnect();
  let settings = await Settings.findOne().lean();
  
  if (!settings) {
    settings = await Settings.create({});
  }
  
  return JSON.parse(JSON.stringify(settings));
}

// Update the settings
export async function updateGlobalSettings(data: any) {
  const session = await auth();
  if (!session || !['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)) {
    return { success: false, error: 'Unauthorized' };
  }

  await dbConnect();

  try {
    const settings = await Settings.findOne();
    if (settings) {
      await Settings.findByIdAndUpdate(settings._id, data);
    } else {
      await Settings.create(data);
    }
    
    // Purge the cache so the frontend header and footer update instantly
    revalidatePath('/', 'layout');
    
    return { success: true };
  } catch (error) {
    console.error('Failed to update settings:', error);
    return { success: false, error: 'Database update failed' };
  }
}