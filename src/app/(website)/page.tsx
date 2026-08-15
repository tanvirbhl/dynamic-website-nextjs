import { notFound } from 'next/navigation';
import dbConnect from '@/lib/db';
import { Page } from '@/models/Page';
import { Section } from '@/models/Section';
import { isPublished, isSectionVisible } from '@/lib/visibility';
import SectionRenderer from '@/components/website/SectionRenderer';

// Generate SEO Metadata dynamically for the homepage
export async function generateMetadata() {
  await dbConnect();
  const page = await Page.findOne({ slug: 'home' }).lean();
  
  if (!page || !isPublished(page)) {
    return {
      title: 'Nova Industries PLC',
      description: 'Global leader in innovation and sustainable growth.',
    };
  }
  
  return { 
    title: page.seo?.title || page.title, 
    description: page.seo?.description 
  };
}

export default async function HomePage() {
  await dbConnect();
  
  // 1. Fetch the homepage explicitly
  const page = await Page.findOne({ slug: 'home' }).lean();

  // 2. Enforce Page Status Rule
  // If the homepage is DRAFT or DISABLED, we return a 404. 
  // In a production environment, you might want to show a "Coming Soon" page instead.
  if (!page || !isPublished(page)) {
    notFound(); 
  }

  // 3. Fetch associated sections
  const rawSections = await Section.find({ pageId: page._id }).lean();

  // 4. Enforce Section Visibility Rule & Ordering
  const activeSections = rawSections
    .filter((section: any) => isSectionVisible(section))
    .sort((a: any, b: any) => a.sortOrder - b.sortOrder);

  return (
    <div className="w-full flex flex-col">
      {activeSections.length > 0 ? (
        activeSections.map((section: any) => (
          <SectionRenderer key={section._id.toString()} section={section} />
        ))
      ) : (
        // Fallback for development if no sections are assigned yet
        <div className="min-h-[60vh] flex items-center justify-center text-slate-500">
          <p>No active sections found for the homepage. Add sections via the CMS.</p>
        </div>
      )}
    </div>
  );
}