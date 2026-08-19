'use client';

import { useState } from 'react';
import { submitContactForm } from '@/actions/website/contact';
import { MapPin, Phone, Mail, Send, Loader2, CheckCircle2 } from 'lucide-react';

export default function ContactClientUI({ settings }: { settings: any }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    const formData = new FormData(e.currentTarget);
    const res = await submitContactForm(formData);
    
    if (res.success) {
      setSuccess(true);
      (e.target as HTMLFormElement).reset();
    } else {
      setError(res.error || 'Failed to send message.');
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
        
        {/* Left Column: Contact Info Card */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100">
            <h2 className="text-2xl font-bold text-[#1e293b] mb-6">Contact Info</h2>
            
            {/* Dynamic Google Maps Embed */}
            <div className="w-full h-48 rounded-xl overflow-hidden mb-8 border border-slate-100">
              {settings.googleMapsUrl ? (
                <iframe 
                  src={settings.googleMapsUrl} 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={false} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              ) : (
                <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400">
                  Map URL not configured
                </div>
              )}
            </div>

            <div className="space-y-8">
              {/* Dynamic Address */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white rounded-full border border-slate-200 flex items-center justify-center text-blue-600 shrink-0 shadow-sm">
                  <MapPin size={20} className="stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#1e293b] text-sm mb-1">Corporate Office</h3>
                  <p className="text-slate-500 text-sm leading-relaxed whitespace-pre-wrap">
                    {settings.contactAddress || "Address not set"}
                  </p>
                </div>
              </div>
              
              {/* Dynamic Phone Numbers */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white rounded-full border border-slate-200 flex items-center justify-center text-blue-600 shrink-0 shadow-sm">
                  <Phone size={20} className="stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#1e293b] text-sm mb-1">Phone Number</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    {settings.contactPhone1 || "Phone not set"}
                    {settings.contactPhone2 && (
                      <><br/>{settings.contactPhone2}</>
                    )}
                  </p>
                </div>
              </div>

              {/* Dynamic Email */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white rounded-full border border-slate-200 flex items-center justify-center text-blue-600 shrink-0 shadow-sm">
                  <Mail size={20} className="stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#1e293b] text-sm mb-1">Email Address</h3>
                  <p className="text-slate-500 text-sm">
                    {settings.contactEmail || "Email not set"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: The Form */}
        <div className="lg:col-span-7 py-4">
          <h1 className="text-4xl font-bold text-[#1e3a5f] mb-4">Get In Touch</h1>
          <p className="text-slate-500 text-lg mb-10 max-w-2xl">
            Have a question or need a quote for your project? Fill out the form below and our team will get back to you promptly.
          </p>

          {success ? (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-12 text-center">
              <CheckCircle2 size={56} className="text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Message Sent!</h3>
              <p className="text-slate-600 mb-6">Thank you for reaching out. We will get back to you as soon as possible.</p>
              <button onClick={() => setSuccess(false)} className="text-blue-600 font-semibold hover:underline">
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-[#1e293b] mb-2">Full Name</label>
                  <input type="text" name="name" placeholder="John Doe" required className="w-full px-4 py-3.5 bg-[#f8fafc] border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-slate-700 placeholder:text-slate-400" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#1e293b] mb-2">Email Address</label>
                  <input type="email" name="email" placeholder="john@example.com" required className="w-full px-4 py-3.5 bg-[#f8fafc] border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-slate-700 placeholder:text-slate-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#1e293b] mb-2">Company / Personal Info</label>
                <input type="text" name="subject" placeholder="Your Company Name or Designation (Optional)" className="w-full px-4 py-3.5 bg-[#f8fafc] border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-slate-700 placeholder:text-slate-400" />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#1e293b] mb-2">Your Message</label>
                <textarea name="message" placeholder="How can we help you?" required rows={5} className="w-full px-4 py-3.5 bg-[#f8fafc] border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none text-slate-700 placeholder:text-slate-400"></textarea>
              </div>

              {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

              <button disabled={isSubmitting} type="submit" className="bg-[#1d4ed8] hover:bg-[#1e40af] text-white py-3.5 px-8 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-70 mt-2">
                {isSubmitting ? (
                  <><Loader2 className="w-5 h-5 animate-spin" />Sending...</>
                ) : (
                  <>Send Message<Send className="w-4 h-4 ml-1" /></>
                )}
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}