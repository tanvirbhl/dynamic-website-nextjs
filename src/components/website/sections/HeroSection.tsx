'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export function HeroSection({ content }: { content: any }) {
  // CMS Content Fallbacks (in case Admin hasn't filled something out)
  const title = content?.title || 'Welcome to Nova Industries';
  const subtitle = content?.subtitle || 'Innovating for a better tomorrow.';
  const bgImage = content?.backgroundImage || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop';
  
  return (
    <section className="relative w-full h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 z-0">
        <Image 
          src={bgImage} 
          alt="Hero Background" 
          fill 
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-slate-900/60" /> 
      </div>

      <div className="container relative z-10 mx-auto px-6 lg:px-12">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl text-center mx-auto"
        >
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white leading-tight mb-6 tracking-tight">
            {title}
          </h1>
          <p className="text-lg md:text-2xl text-slate-200 mb-10 max-w-2xl mx-auto font-light">
            {subtitle}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {content?.button1 && content?.button1Url && (
              <Link 
                href={content.button1Url} 
                className="w-full sm:w-auto bg-[var(--color-primary)] hover:bg-opacity-90 text-white px-8 py-3.5 rounded-sm font-semibold transition-all shadow-lg hover:shadow-xl"
              >
                {content.button1}
              </Link>
            )}
            {content?.button2 && content?.button2Url && (
              <Link 
                href={content.button2Url} 
                className="w-full sm:w-auto bg-transparent border border-white hover:bg-white hover:text-slate-900 text-white px-8 py-3.5 rounded-sm font-semibold transition-all"
              >
                {content.button2}
              </Link>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}