'use client';

import Link from 'next/link';
import { NavNode } from '@/lib/visibility';
import { ChevronDown } from 'lucide-react';

export default function Navigation({ navTree }: { navTree: NavNode[] }) {
  return (
    <nav className="hidden lg:flex items-center gap-8">
      {navTree.map((item) => {
        const hasChildren = item.children && item.children.length > 0;

        return (
          <div key={item._id} className="relative group">
            <Link 
              href={item.url} 
              target={item.openInNewTab ? '_blank' : '_self'}
              className="flex items-center gap-1 text-sm font-semibold text-slate-700 hover:text-[var(--color-primary)] transition-colors py-8"
            >
              {item.label}
              {hasChildren && <ChevronDown className="w-4 h-4" />}
            </Link>

            {/* Dropdown Menu */}
            {hasChildren && (
              <div className="absolute top-full left-0 w-56 bg-white shadow-xl border border-slate-100 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200 transform origin-top-left scale-95 group-hover:scale-100 z-50">
                <div className="py-2">
                  {item.children.map((child) => (
                    <Link
                      key={child._id}
                      href={child.url}
                      target={child.openInNewTab ? '_blank' : '_self'}
                      className="block px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-[var(--color-primary)] transition-colors"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}