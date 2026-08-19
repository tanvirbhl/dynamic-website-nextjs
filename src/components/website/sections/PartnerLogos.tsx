export function PartnerLogos({ content }: { content: any }) {
  if (!content) return null;

  // Extract only the uploaded logos, ignoring empty slots
  const logos = [
    content.logo1, content.logo2, content.logo3, 
    content.logo4, content.logo5, content.logo6
  ].filter(Boolean);

  if (logos.length === 0) return null;

  // Duplicate the array twice to ensure a seamless infinite scroll loop
  const infiniteLogos = [...logos, ...logos, ...logos, ...logos];

  return (
    <section className="py-12 bg-white border-y border-slate-100 overflow-hidden relative">
      <div className=" mx-auto px-6">
        
        {content.heading && (
          <h3 className="text-center text-sm font-bold text-slate-400 uppercase tracking-[0.2em] mb-10">
            {content.heading}
          </h3>
        )}
        
        {/* Fading Edges Overlay */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

        {/* Scrolling Track */}
        <div className="flex overflow-hidden group">
          <div className="flex space-x-16 items-center w-max animate-infinite-scroll group-hover:[animation-play-state:paused]">
            {infiniteLogos.map((logo, idx) => (
              <img 
                key={idx} 
                src={logo} 
                alt="Partner Logo" 
                className="h-10 w-auto object-contain grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300" 
              />
            ))}
          </div>
        </div>

      </div>

      {/* Inline styles for the custom marquee animation */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes infinite-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-infinite-scroll {
          animation: infinite-scroll 20s linear infinite;
        }
      `}} />
    </section>
  );
}