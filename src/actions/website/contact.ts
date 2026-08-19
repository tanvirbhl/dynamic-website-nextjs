'use server';

import dbConnect from '@/lib/db';
import { Message } from '@/models/Message';

export async function submitContactForm(formData: FormData) {
  try {
    await dbConnect();

    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      subject: formData.get('subject'), // This is the Company/Personal Info field
      message: formData.get('message'),
    };

    if (!data.name || !data.email || !data.message) {
      return { success: false, error: 'Name, email, and message are required.' };
    }

    await Message.create(data);

    return { success: true, message: 'Your message has been sent successfully!' };
  } catch (error: any) {
    console.error('Contact Form Error:', error);
    return { success: false, error: 'Something went wrong. Please try again later.' };
  }
}