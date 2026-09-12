import React, { useState } from 'react';
import { PageRoute } from '../types';
import { APP_CONFIG } from '../config/appConfig';
import { SEOHead } from '../components/common/SEOHead';
import { LoungeMapSvg } from '../components/common/LoungeMapSvg';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, Navigation } from 'lucide-react';

interface ContactPageProps {
  onNavigate: (page: PageRoute) => void;
}

export const ContactPage: React.FC<ContactPageProps> = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div id="contact-page" className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      <SEOHead
        title="Contact & Location | NOIR HOOKAH VIP Lounge"
        description="Navigate to NOIR HOOKAH Lounge in Gulberg III, Lahore or reach our 24/7 VIP Concierge line."
      />

      <div className="text-center space-y-3 max-w-xl mx-auto">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#d4af37] font-semibold">
          24/7 VIP CONCIERGE
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold font-serif-luxury text-white">
          Contact & Location
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400">
          Reach our VIP relations team or navigate directly to our Gulberg III lounge location.
        </p>
      </div>

      {/* SVG Interactive Map */}
      <LoungeMapSvg />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Info Column */}
        <div className="lg:col-span-5 space-y-6 bg-[#121216] border border-neutral-800 p-8 rounded-3xl glass-panel">
          <h2 className="text-2xl font-bold font-serif-luxury text-white">
            NOIR HOOKAH Lounge
          </h2>

          <div className="space-y-4 text-xs text-neutral-300">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block">Address:</strong>
                <span>{APP_CONFIG.brand.address}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block">VIP Phone Line:</strong>
                <span>{APP_CONFIG.brand.phone}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block">Email Concierge:</strong>
                <span>{APP_CONFIG.brand.email}</span>
              </div>
            </div>

            <div className="flex items-start gap-3 pt-3 border-t border-neutral-800">
              <Clock className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block">Lounge Opening Hours:</strong>
                <div>Monday – Thursday: {APP_CONFIG.brand.openingHours.weekdays}</div>
                <div>Friday – Sunday: {APP_CONFIG.brand.openingHours.weekends}</div>
              </div>
            </div>
          </div>

          <a
            href="https://maps.google.com"
            target="_blank"
            rel="noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa820a] text-[#0a0a0c] font-bold text-xs uppercase tracking-widest shadow-lg hover:brightness-110"
          >
            <Navigation className="w-4 h-4" />
            <span>Open in Google Maps</span>
          </a>
        </div>

        {/* Contact Form Column */}
        <div className="lg:col-span-7 bg-[#121216] border border-neutral-800 p-8 rounded-3xl glass-panel">
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-[#d4af37] mx-auto" />
              <h3 className="text-2xl font-bold font-serif-luxury text-white">Message Dispatched</h3>
              <p className="text-xs text-neutral-300 max-w-sm mx-auto">
                Thank you. Our VIP relations desk will respond to your message promptly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-xs uppercase tracking-widest text-[#d4af37] border-b border-[#d4af37] pb-1"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-xl font-bold font-serif-luxury text-white">Direct Message</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-neutral-400 block mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#0a0a0c] border border-neutral-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-wider text-neutral-400 block mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#0a0a0c] border border-neutral-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider text-neutral-400 block mb-1">
                  Subject
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full bg-[#0a0a0c] border border-neutral-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                >
                  <option>General Inquiry</option>
                  <option>VIP Table Reservation Query</option>
                  <option>Feedback / Night Experience</option>
                  <option>Corporate Partnership</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider text-neutral-400 block mb-1">
                  Your Message
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-[#0a0a0c] border border-neutral-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-[#d4af37] via-[#e6c687] to-[#aa820a] text-[#0a0a0c] font-bold text-xs uppercase tracking-widest rounded-xl shadow-lg hover:brightness-110"
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
