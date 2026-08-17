import dbConnect from '@/lib/db';
import { Business } from '@/models/Business';
import { Product } from '@/models/Product'; // <-- NEW
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Globe, CheckCircle2 } from 'lucide-react'; // <-- ADDED CheckCircle2
import { Metadata } from 'next';

// Dynamic SEO Tags
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  await dbConnect();
  const { slug } = await params;
  const business = await Business.findOne({ slug, status: 'PUBLISHED' }).lean();

  if (!business) return {};
  
  return { 
    title: `${(business as any).name} | Nova Industries`,
    description: (business as any).shortDescription
  };
}

export default async function BusinessProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  await dbConnect();
  
  // 1. Fetch the business
  const business = await Business.findOne({ slug, status: 'PUBLISHED' }).lean();
  if (!business) return notFound();

  // 2. Fetch the published products belonging to this business
  const products = await Product.find({ 
    businessId: business._id, 
    status: 'PUBLISHED' 
  }).sort('sortOrder').lean();

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Hero Header */}
      <div className="relative w-full h-[40vh] min-h-[300px] bg-slate-900">
        {(business as any).coverImageUrl && (
          <img 
            src={(business as any).coverImageUrl} 
            alt="" 
            className="absolute inset-0 w-full h-full object-cover opacity-40" 
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent" />
        
        <div className="absolute bottom-0 w-full">
          <div className="max-w-5xl mx-auto px-6 pb-12 flex flex-col md:flex-row items-end gap-6">
            {(business as any).logoUrl && (
              <div className="w-32 h-32 bg-white rounded-xl shadow-xl p-4 flex items-center justify-center shrink-0 mb-[-2rem] z-10">
                <img 
                  src={(business as any).logoUrl} 
                  alt="Logo" 
                  className="max-w-full max-h-full object-contain" 
                />
              </div>
            )}
            <div className="mb-2 z-10 flex-1">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{(business as any).name}</h1>
              <p className="text-xl text-slate-300 max-w-2xl">{(business as any).shortDescription}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="max-w-5xl mx-auto px-6 pt-16">
        <Link href="/businesses" className="inline-flex items-center gap-2 text-sm font-medium text-[rgb(var(--color-primary))] hover:underline mb-8 transition-colors">
          <ArrowLeft size={16} /> Back to All Businesses
        </Link>
        
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">About {(business as any).name}</h2>
          
          <div className="prose max-w-none text-slate-600 mb-10 whitespace-pre-wrap leading-relaxed">
            {(business as any).fullDescription || 'No detailed description available at this time.'}
          </div>
          
          {(business as any).websiteUrl && (
            <div className="pt-8 border-t border-slate-100">
              <a 
                href={(business as any).websiteUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-md hover:bg-[rgb(var(--color-primary))] transition-colors font-medium shadow-sm"
              >
                <Globe size={18} />
                Visit Official Website
              </a>
            </div>
          )}
        </div>

        {/* Dynamic Products & Brands Section */}
        {products.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-slate-800 mb-8">Products & Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {products.map((product: any) => (
                <div key={product._id.toString()} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex gap-6 hover:shadow-md transition-shadow">
                  
                  {product.imageUrl && (
                    <div className="w-24 h-24 shrink-0 bg-slate-50 rounded-lg border border-slate-100 p-2 flex items-center justify-center">
                      <img 
                        src={product.imageUrl} 
                        alt={product.name} 
                        className="max-w-full max-h-full object-contain" 
                      />
                    </div>
                  )}
                  
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{product.name}</h3>
                    <p className="text-sm text-slate-600 mb-4">{product.shortDescription}</p>
                    
                    {/* Render Features as Bullet Points */}
                    {product.features && product.features.length > 0 && (
                      <ul className="space-y-1.5">
                        {product.features.map((feature: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-slate-500">
                            <CheckCircle2 size={14} className="text-[rgb(var(--color-primary))] shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}