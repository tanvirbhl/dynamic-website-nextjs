import Link from 'next/link';
import dbConnect from '@/lib/db';
import { Navigation } from '@/models/Navigation';

export default async function Header() {
  await dbConnect();
  
  // 1. Fetch only visible navigation items, sorted by their configured order
  const rawNavItems = await Navigation.find({ isVisible: true }).sort('sortOrder').lean();
  
  // 2. Serialize MongoDB ObjectIds to strings
  const navItems = rawNavItems.map((item: any) => ({
    ...item,
    _id: item._id.toString(),
    parentId: item.parentId ? item.parentId.toString() : null,
  }));

  // 3. Separate top-level links from nested children
  const topLevelLinks = navItems.filter(item => !item.parentId);
  const getChildren = (parentId: string) => navItems.filter(item => item.parentId === parentId);

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Global Logo */}
        <Link href="/" className="font-bold text-xl tracking-wider text-slate-900">
          NOVA INDUSTRIES
        </Link>

        {/* Dynamic Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {topLevelLinks.map(link => {
            const children = getChildren(link._id);
            const hasChildren = children.length > 0;

            if (hasChildren) {
              return (
                <div key={link._id} className="relative group">
                  <button className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors py-2">
                    {link.label}
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute top-full right-0 mt-1 w-56 bg-white border border-slate-200 shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 flex flex-col py-2">
                    {children.map(child => (
                      <Link 
                        key={child._id} 
                        href={child.url} 
                        className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-[rgb(var(--color-primary))] transition-colors"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            }

            return (
              <Link 
                key={link._id} 
                href={link.url} 
                className="text-sm font-medium text-slate-600 hover:text-[rgb(var(--color-primary))] transition-colors py-2"
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Optional Mobile Menu Button placeholder */}
        <button className="md:hidden p-2 text-slate-600">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

      </div>
    </header>
  );
}