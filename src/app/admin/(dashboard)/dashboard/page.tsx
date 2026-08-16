import dbConnect from '@/lib/db';
import { Page } from '@/models/Page';
import { Section } from '@/models/Section';
import { SectionList } from '@/components/admin/SectionList';

export default async function DashboardPage() {
  await dbConnect();
  
  const homePage = await Page.findOne({ slug: 'home' }).lean();
  let sections = [];
  if (homePage) {
    sections = await Section.find({ pageId: homePage._id }).sort('sortOrder').lean();
  }

  // Convert MongoDB ObjectIds to strings to prevent React serialization errors
  const serializedSections = sections.map((s: any) => ({
    ...s,
    _id: s._id.toString(),
    pageId: s.pageId.toString(),
  }));

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Welcome to Nova CMS</h1>
        <p className="text-slate-600">
          Authentication was successful. You are now inside the secure enterprise dashboard.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">Homepage Sections (Live Control)</h2>
            <p className="text-sm text-slate-500">
              Drag and drop sections to reorder them on the public website. Use the toggle to instantly hide or show them.
            </p>
          </div>
        </div>
        
        {/* The interactive drag-and-drop container */}
        <SectionList pageId={homePage._id.toString()} initialSections={serializedSections} />
      </div>
    </div>
  );
}