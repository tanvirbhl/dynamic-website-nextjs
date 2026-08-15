import dbConnect from '@/lib/db';
import { MenuItem } from '@/models/Menu';
import { buildActiveMenuTree } from '@/lib/visibility';
import Navigation from '@/components/website/Navigation';

// This forces Next.js to re-fetch the layout data periodically or on demand, 
// ensuring Admin changes to the menu appear quickly.
export const revalidate = 60; 

export default async function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await dbConnect();

  // Fetch all menu items (the visibility utility will handle filtering)
  const rawMenuItems = await MenuItem.find({}).lean();
  
  // Build the hierarchical, active-only navigation tree
  const navTree = buildActiveMenuTree(rawMenuItems);

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-bg)]">
      <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          {/* Logo Placeholder */}
          <div className="font-bold text-2xl text-[var(--color-primary)]">
            NOVA INDUSTRIES
          </div>
          
          {/* Client-side interactive navigation component */}
          <Navigation navTree={navTree} />
        </div>
      </header>

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