import Navigation from '@/components/website/Navigation';

// This forces Next.js to re-fetch the layout data periodically
export const revalidate = 60; 

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-bg)]">
      
      {/* 
        The Navigation component now handles its own data fetching 
        and contains the proper <header> HTML structure.
      */}
      <Navigation />

      {/* Dynamic Page Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer Placeholder */}
      <footer className="bg-slate-900 text-white py-12 text-center">
        <p>© {new Date().getFullYear()} Nova Industries PLC. All rights reserved.</p>
      </footer>
    </div>
  );
}