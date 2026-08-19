'use server';

import dbConnect from '@/lib/db';
import { Message } from '@/models/Message';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';

export async function markMessageRead(id: string) {
  const session = await auth();
  if (!session) return { success: false, error: 'Unauthorized' };

  try {
    await dbConnect();
    await Message.findByIdAndUpdate(id, { status: 'READ' });
    revalidatePath('/admin/messages');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to update message' };
  }
}

export async function deleteMessage(id: string) {
  const session = await auth();
  if (!session) return { success: false, error: 'Unauthorized' };

  try {
    await dbConnect();
    await Message.findByIdAndDelete(id);
    revalidatePath('/admin/messages');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to delete message' };
  }
}