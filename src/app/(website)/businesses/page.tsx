import dbConnect from '@/lib/db';
import { Business } from '@/models/Business';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

export const metadata = {
  title: 'Our Businesses | Nova Industries',
  description: 'Explore the diverse portfolio of subsidiaries and brands under Nova Industries.',
};

export default async function BusinessesIndexPage() {
  await dbConnect();
  
  // Fetch only published businesses
  const businesses = await Business.find({ status: 'PUBLISHED' }).sort('sortOrder').lean();

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 min-h-screen">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Our Businesses</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Explore the diverse portfolio of companies and subsidiaries driving innovation across multiple sectors.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {businesses.map((business: any) => (
          <Link 
            href={`/businesses/${business.slug}`} 
            key={business._id.toString()} 
            className="group bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-all flex flex-col"
          >
            {/* Image Header */}
            <div className="h-48 bg-slate-100 relative overflow-hidden">
              {business.coverImageUrl ? (
                <img 
                  src={business.coverImageUrl} 
                  alt={business.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
              ) : (
                <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400 text-sm">
                  No Cover Image
                </div>
              )}
              
              {/* Floating Logo */}
              {business.logoUrl && (
                <div className="absolute bottom-4 left-4 w-16 h-16 bg-white rounded-lg shadow-md p-2 flex items-center justify-center">
                  <img 
                    src={business.logoUrl} 
                    alt={`${business.name} Logo`} 
                    className="max-w-full max-h-full object-contain" 
                  />
                </div>
              )}
            </div>
            
            {/* Card Content */}
            <div className="p-6 flex-1 flex flex-col">
              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-[rgb(var(--color-primary))] transition-colors">
                {business.name}
              </h3>
              <p className="text-sm text-slate-600 mb-4 flex-1 line-clamp-3">
                {business.shortDescription}
              </p>
              <span className="text-[rgb(var(--color-primary))] text-sm font-semibold flex items-center gap-1 mt-auto">
                View Profile <ExternalLink size={14} />
              </span>
            </div>
          </Link>
        ))}
      </div>
      
      {businesses.length === 0 && (
        <div className="text-center text-slate-500 py-12">
          No businesses published yet.
        </div>
      )}
    </div>
  );
}