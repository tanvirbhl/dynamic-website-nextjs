import Link from 'next/link';
import dbConnect from '@/lib/db';
import { Navigation as NavigationModel } from '@/models/Navigation';
import { Settings } from '@/models/Settings';

// 👇 RECURSIVE COMPONENT FOR MULTI-LEVEL FLYOUT MENUS 👇
const RecursiveNavItem = ({ item, allItems, depth = 0 }: { item: any, allItems: any[], depth?: number }) => {
  const children = allItems.filter(i => i.parentId === item._id);
  const hasChildren = children.length > 0;

  // Base Case: No children, just render a normal link
  if (!hasChildren) {
    return (
      <Link 
        href={item.url} 
        className={
          depth === 0 
            ? "text-sm font-medium text-slate-600 hover:text-[rgb(var(--color-primary))] transition-colors py-2"
            : "block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-[rgb(var(--color-primary))] transition-colors"
        }
      >
        {item.label}
      </Link>
    );
  }

  // Recursive Case: Has children, render a dropdown that opens another sub-menu
  return (
    <div className="relative group/navitem">
      {/* Menu Trigger Button */}
      <button className={
        depth === 0
          ? "flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors py-2 w-full"
          : "flex items-center justify-between w-full px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
      }>
        {item.label}
        <svg 
          className={`w-4 h-4 transition-transform ${depth > 0 ? '-rotate-90' : ''}`} 
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {/* The Sub-menu Container */}
      {/* If depth is 0 (Top level), it drops down. If depth > 0, it flies out to the right. */}
      <div className={`
        absolute ${depth === 0 ? 'top-full left-0 mt-1' : 'top-0 left-full ml-1 -mt-2'} 
        w-56 bg-white border border-slate-200 shadow-lg rounded-md 
        opacity-0 invisible group-hover/navitem:opacity-100 group-hover/navitem:visible 
        transition-all duration-200 flex flex-col py-2 z-50
      `}>
        {children.map(child => (
          <RecursiveNavItem key={child._id} item={child} allItems={allItems} depth={depth + 1} />
        ))}
      </div>
    </div>
  );
};


export default async function Navigation() {
  await dbConnect();
  
  // 1. Fetch Global Settings for the brand name and logo
  const settings = await Settings.findOne().lean() || { brandName: 'NOVA INDUSTRIES', logoUrl: '' };

  // 2. Fetch only visible navigation items, sorted by their configured order
  const rawNavItems = await NavigationModel.find({ isVisible: true }).sort('sortOrder').lean();
  
  // 3. Serialize MongoDB ObjectIds to strings and normalize empty strings to null
  const navItems = rawNavItems.map((item: any) => ({
    ...item,
    _id: item._id.toString(),
    parentId: item.parentId ? item.parentId.toString() : null,
  }));

  // 4. Find the root links (items with no parent)
  const topLevelLinks = navItems.filter(item => !item.parentId);

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Dynamic Global Logo / Brand Name */}
        <Link href="/" className="flex items-center gap-2">
          {settings.logoUrl ? (
            <img 
              src={settings.logoUrl} 
              alt={settings.brandName} 
              className="h-8 w-auto object-contain" 
            />
          ) : (
            <span className="font-bold text-xl tracking-wider text-slate-900 uppercase">
              {settings.brandName}
            </span>
          )}
        </Link>

        {/* Dynamic Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {/* 👇 Render the top level, and the recursive component handles the rest! */}
          {topLevelLinks.map(link => (
            <RecursiveNavItem key={link._id} item={link} allItems={navItems} depth={0} />
          ))}
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