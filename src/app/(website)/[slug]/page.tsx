import { notFound } from 'next/navigation';
import dbConnect from '@/lib/db';
import { Page } from '@/models/Page';
import { Section } from '@/models/Section';
import { isPublished, isSectionVisible } from '@/lib/visibility';
import SectionRenderer from '@/components/website/SectionRenderer';

// Next.js 15 requires params to be treated as a Promise
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  
  await dbConnect();
  const page = await Page.findOne({ slug: resolvedParams.slug }).lean();
  
  if (!page || !isPublished(page as any)) return {};
  
  return { 
    title: (page as any).seo?.title || (page as any).title, 
    description: (page as any).seo?.description 
  };
}

export default async function DynamicPage({ params }: { params: Promise<{ slug: string }> }) {
  // Await the params before using them (Next.js 15 requirement)
  const resolvedParams = await params;
  
  await dbConnect();
  
  // 1. Fetch the page
  const page = await Page.findOne({ slug: resolvedParams.slug }).lean();

  // 2. Enforce Page Status Rule
  if (!page || !isPublished(page as any)) {
    notFound(); 
  }

  // 3. Fetch associated sections
  const rawSections = await Section.find({ pageId: page._id }).lean();

  // 4. Enforce Section Visibility Rule & Ordering
  const activeSections = rawSections
    .filter((section: any) => isSectionVisible(section))
    .sort((a: any, b: any) => a.sortOrder - b.sortOrder);

  return (
    <>
      {activeSections.map((section: any) => (
        <SectionRenderer key={section._id.toString()} section={section} />
      ))}
    </>
  );
}