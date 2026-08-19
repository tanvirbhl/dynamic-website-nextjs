import { Quote } from 'lucide-react';

interface LeadershipMessageProps {
  content: {
    sectionTitle?: string; // <-- Added here
    name?: string;
    designation?: string;
    message?: string;
    image?: string;
  };
}

export function LeadershipMessage({ content }: LeadershipMessageProps) {
  if (!content) return null;

  return (
    <section className="py-24 bg-white border-y border-slate-100">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center gap-16">
          
          {/* Left: Portrait Image */}
          <div className="w-full md:w-5/12 shrink-0">
            <div className="relative">
              <div className="absolute inset-0 bg-[rgb(var(--color-primary))] translate-x-4 translate-y-4 rounded-xl -z-10 opacity-20"></div>
              {content.image ? (
                <img 
                  src={content.image} 
                  alt={content.name || 'Leadership'} 
                  className="w-full h-auto object-cover rounded-xl shadow-lg border border-slate-100 aspect-[4/5]"
                />
              ) : (
                <div className="w-full aspect-[4/5] bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 border border-slate-200">
                  <span className="text-sm">Portrait Placeholder</span>
                </div>
              )}
            </div>
          </div>

          {/* Right: Message Content */}
          <div className="w-full md:w-7/12">
            {/* 👇 ADDED THE DYNAMIC TITLE HERE 👇 */}
            {content.sectionTitle && (
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8">
                {content.sectionTitle}
              </h2>
            )}
            
            <Quote className="text-[rgb(var(--color-primary))] w-12 h-12 opacity-20 mb-6" />
            
            <p className="text-xl md:text-2xl leading-relaxed text-slate-700 font-medium mb-10 whitespace-pre-wrap">
              {content.message || 'Enter the leadership message or vision statement here...'}
            </p>
            
            <div className="border-l-4 border-[rgb(var(--color-primary))] pl-4">
              <h3 className="text-xl font-bold text-slate-900">{content.name || 'Leader Name'}</h3>
              <p className="text-slate-500 font-medium mt-1">
                {content.designation || 'Designation'}
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}