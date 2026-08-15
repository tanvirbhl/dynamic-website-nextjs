'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function AboutSection({ content }: { content: any }) {
  const heading = content?.heading || 'About Nova Industries';
  const description = content?.description || 'We are a global leader in innovation and sustainable growth.';
  const image = content?.image || 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop';
  
  // Optional statistics array from CMS
  const stats = content?.statistics || [];

  return (
    <section className="py-20 lg:py-32 bg-white overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl lg:text-5xl font-bold text-slate-900 mb-6 leading-tight">
              {heading}
            </h2>
            <div className="prose prose-lg text-slate-600 mb-8 max-w-none">
              <p>{description}</p>
            </div>

            {/* Dynamic Statistics Block */}
            {stats.length > 0 && (
              <div className="grid grid-cols-2 gap-6 mb-10 border-t border-slate-100 pt-8">
                {stats.map((stat: any, index: number) => (
                  <div key={index}>
                    <div className="text-3xl font-bold text-[var(--color-primary)] mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {content?.button && content?.buttonUrl && (
              <Link 
                href={content.buttonUrl} 
                className="inline-flex items-center gap-2 text-[var(--color-primary)] font-semibold hover:gap-3 transition-all"
              >
                {content.button}
                <ArrowRight className="w-5 h-5" />
              </Link>
            )}
          </motion.div>

          {/* Image Content */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative h-[500px] lg:h-[650px] w-full rounded-sm overflow-hidden shadow-2xl"
          >
            <Image 
              src={image} 
              alt="About Us" 
              fill 
              className="object-cover hover:scale-105 transition-transform duration-1000"
            />
            {/* Design Accent Box */}
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[var(--color-secondary)] -z-10 rounded-sm" />
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}