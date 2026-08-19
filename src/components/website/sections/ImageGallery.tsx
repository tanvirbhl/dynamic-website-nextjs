export function ImageGallery({ content }: { content: any }) {
  if (!content) return null;

  // Extract only the uploaded images, filtering out any empty slots
  const images = [
    content.image1, content.image2, content.image3, 
    content.image4, content.image5, content.image6
  ].filter(Boolean);

  if (images.length === 0) return null;

  return (
    <section className="py-20 bg-slate-50 border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Gallery Header */}
        {(content.heading || content.description) && (
          <div className="text-center max-w-2xl mx-auto mb-12">
            {content.heading && (
              <h2 className="text-3xl font-bold text-slate-900 mb-4">{content.heading}</h2>
            )}
            {content.description && (
              <p className="text-slate-600 leading-relaxed">{content.description}</p>
            )}
          </div>
        )}
        
        {/* Image Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {images.map((imgSrc, idx) => (
            <div 
              key={idx} 
              className="relative overflow-hidden rounded-xl shadow-sm aspect-[4/3] group cursor-pointer"
            >
              <img 
                src={imgSrc} 
                alt={`Gallery image ${idx + 1}`} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {/* Optional Dark Overlay on Hover */}
              <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors duration-500"></div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}