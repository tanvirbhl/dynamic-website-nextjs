import Navigation from '@/components/website/Navigation';
import dbConnect from '@/lib/db';
import { Settings } from '@/models/Settings';

export const revalidate = 60; 

export default async function WebsiteLayout({ children }: { children: React.ReactNode }) {
  await dbConnect();
  
  // Fetch settings for the footer
  const settings = await Settings.findOne().lean() || { footerText: '© {year} All rights reserved.' };
  
  // Replace the {year} tag dynamically
  const footerText = settings.footerText.replace('{year}', new Date().getFullYear().toString());

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-bg)]">
      <Navigation />

      <main className="flex-grow">
        {children}
      </main>

      {/* Dynamic Footer */}
      <footer className="bg-slate-900 text-white py-12 text-center">
        <p>{footerText}</p>
      </footer>
    </div>
  );
}