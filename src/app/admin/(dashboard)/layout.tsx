import Link from 'next/link';
import { auth, signOut } from '@/auth';
import { 
  LayoutDashboard, Files, MenuSquare, Settings, 
  LogOut, Users, Building2, PackageSearch, 
  Newspaper, ImageIcon 
} from 'lucide-react';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // We fetch the session just to get the user's name and role for the sidebar.
  // The proxy.ts file handles the actual security and redirects.
  const session = await auth();

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-950">
          <span className="text-white font-bold text-lg tracking-wider">NOVA CMS</span>
        </div>

        <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
          <nav className="space-y-1 px-3">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-3 mt-4">Dashboard</div>
            <SidebarLink href="/admin/dashboard" icon={<LayoutDashboard size={18} />} label="Overview" />
            
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-3 mt-6">Website</div>
            <SidebarLink href="/admin/pages" icon={<Files size={18} />} label="Pages" />
            <SidebarLink href="/admin/navigation" icon={<MenuSquare size={18} />} label="Navigation" />
            
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-3 mt-6">Content</div>
            <SidebarLink href="/admin/businesses" icon={<Building2 size={18} />} label="Businesses" />
            <SidebarLink href="/admin/products" icon={<PackageSearch size={18} />} label="Products" />
            <SidebarLink href="/admin/news" icon={<Newspaper size={18} />} label="News & Events" />
            
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-3 mt-6">Assets</div>
            <SidebarLink href="/admin/media" icon={<ImageIcon size={18} />} label="Media Library" />

            {session?.user?.role === 'SUPER_ADMIN' && (
              <>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-3 mt-6">System</div>
                <SidebarLink href="/admin/users" icon={<Users size={18} />} label="Users" />
                <SidebarLink href="/admin/settings" icon={<Settings size={18} />} label="Settings" />
              </>
            )}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-950">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-white font-bold">
              {session?.user?.name?.[0] || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{session?.user?.name}</p>
              <p className="text-xs text-slate-500 truncate">{session?.user?.role}</p>
            </div>
          </div>
          <form action={async () => { 'use server'; await signOut({ redirectTo: '/admin/login' }); }}>
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm rounded transition-colors">
              <LogOut size={16} />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800">Admin Dashboard</h2>
        </header>
        
        <div className="flex-1 overflow-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

function SidebarLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link 
      href={href} 
      className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
    >
      {icon}
      {label}
    </Link>
  );
}