import dbConnect from '@/lib/db';
import { Settings } from '@/models/Settings';
import ContactClientUI from './ContactClientUI';

export default async function ContactPage() {
  await dbConnect();
  
  // Fetch the dynamic settings from your database
  const settingsData = await Settings.findOne().lean() || {};
  
  // Convert MongoDB ObjectId to string to pass to Client Component safely
  const settings = {
    ...settingsData,
    _id: settingsData._id?.toString()
  };

  // Pass the dynamic settings to the Client UI
  return <ContactClientUI settings={settings} />;
}