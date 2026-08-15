import { HeroSection } from './sections/HeroSection';
import { AboutSection } from './sections/AboutSection';

interface SectionProps {
  section: {
    _id: string;
    type: string;
    content: any;
    isVisible: boolean;
  };
}

export default function SectionRenderer({ section }: SectionProps) {
  // Final safety check just to be absolutely certain
  if (!section.isVisible) return null;

  switch (section.type) {
    case 'hero':
      return <HeroSection content={section.content} />;
    
    case 'about':
      return <AboutSection content={section.content} />;
    
    // Future sections will be added here:
    // case 'businesses': return <BusinessesSection content={section.content} />
    // case 'news': return <NewsSection content={section.content} />
    
    default:
      // Graceful fallback for development; renders nothing in production
      if (process.env.NODE_ENV === 'development') {
        return (
          <div className="p-8 text-center bg-red-50 border border-red-200 text-red-600 my-4 container mx-auto">
            <p className="font-bold">Missing Component</p>
            <p className="text-sm">No React component found for section type: <strong>{section.type}</strong></p>
          </div>
        );
      }
      return null;
  }
}