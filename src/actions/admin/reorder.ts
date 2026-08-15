'use server';

import { revalidatePath } from 'next/cache';
import dbConnect from '@/lib/db';
import { Section } from '@/models/Section';
import { auth } from '@/auth';

export async function updateSectionOrder(orderedIds: string[]) {
  const session = await auth();
  if (!session || !['SUPER_ADMIN', 'ADMIN', 'EDITOR'].includes(session.user.role)) {
    return { success: false, error: 'Unauthorized' };
  }

  await dbConnect();

  try {
    // Create an array of update operations for MongoDB
    const bulkOperations = orderedIds.map((id, index) => ({
      updateOne: {
        filter: { _id: id },
        // Use index + 1 so sortOrder starts at 1, 2, 3...
        update: { $set: { sortOrder: index + 1 } }, 
      },
    }));

    // Execute all updates simultaneously
    if (bulkOperations.length > 0) {
      await Section.bulkWrite(bulkOperations);
    }

    // Purge the cache so the public frontend instantly updates
    revalidatePath('/', 'layout');
    
    return { success: true };
  } catch (error) {
    console.error('Failed to update section order:', error);
    return { success: false, error: 'Database update failed' };
  }
}