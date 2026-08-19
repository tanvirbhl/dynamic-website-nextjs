import { HeroSection } from "./sections/HeroSection";
import { AboutSection } from "./sections/AboutSection";
import { LatestNoticesFeed } from "./sections/LatestNoticesFeed";
import { LeadershipMessage } from "./sections/LeadershipMessage";
import { PartnerLogos } from "./sections/PartnerLogos";
import { ImageGallery } from "./sections/ImageGallery";
import { CoreValues } from "./sections/CoreValues";

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
    case "hero":
      return <HeroSection content={section.content} />;

    case "about":
      return <AboutSection content={section.content} />;

    case "RECENT_NOTICES":
      return <LatestNoticesFeed limit={3} />;
    case "LEADERSHIP_MESSAGE":
      return <LeadershipMessage content={section.content} />;
    case "PARTNER_LOGOS":
      return <PartnerLogos content={section.content} />;
    case "IMAGE_GALLERY":
      return <ImageGallery content={section.content} />;
    case "CORE_VALUES":
      return <CoreValues content={section.content} />;
    default:
      // Graceful fallback for development; renders nothing in production
      if (process.env.NODE_ENV === "development") {
        return (
          <div className="p-8 text-center bg-red-50 border border-red-200 text-red-600 my-4 container mx-auto">
            <p className="font-bold">Missing Component</p>
            <p className="text-sm">
              No React component found for section type:{" "}
              <strong>{section.type}</strong>
            </p>
          </div>
        );
      }
      return null;
  }
}
