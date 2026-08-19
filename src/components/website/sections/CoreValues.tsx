export function CoreValues({ content }: { content: any }) {
  if (!content) return null;

  // Compile the blocks dynamically, filtering out any that don't have a title
  const values = [
    { title: content.value1Title, desc: content.value1Desc, icon: content.value1Icon },
    { title: content.value2Title, desc: content.value2Desc, icon: content.value2Icon },
    { title: content.value3Title, desc: content.value3Desc, icon: content.value3Icon },
    { title: content.value4Title, desc: content.value4Desc, icon: content.value4Icon },
  ].filter(v => v.title);

  if (values.length === 0 && !content.heading) return null;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        {(content.heading || content.description) && (
          <div className="text-center max-w-3xl mx-auto mb-16">
            {content.heading && (
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{content.heading}</h2>
            )}
            {content.description && (
              <p className="text-lg text-slate-600 leading-relaxed">{content.description}</p>
            )}
          </div>
        )}
        
        {/* Values Grid */}
        {values.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, idx) => (
              <div 
                key={idx} 
                className="p-8 bg-slate-50 border border-slate-100 rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-center flex flex-col items-center"
              >
                {/* Icon Rendering */}
                {value.icon ? (
                  <div className="w-16 h-16 mb-6 rounded-full bg-white shadow-sm flex items-center justify-center p-3 border border-slate-100">
                    <img src={value.icon} alt={value.title} className="w-full h-full object-contain" />
                  </div>
                ) : (
                  <div className="w-16 h-16 mb-6 rounded-full bg-[rgb(var(--color-primary))] opacity-10" />
                )}
                
                <h3 className="text-xl font-bold text-slate-900 mb-3">{value.title}</h3>
                
                {value.desc && (
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {value.desc}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}