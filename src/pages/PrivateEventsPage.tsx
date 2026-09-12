import React, { useState } from 'react';
import { PageRoute, SeatingPreference, PrivateEventInquiry } from '../types';
import { reservationService } from '../services/reservationService';
import { Sparkles, Calendar, Users, DollarSign, Send, CheckCircle2 } from 'lucide-react';

interface PrivateEventsPageProps {
  onNavigate: (page: PageRoute) => void;
}

export const PrivateEventsPage: React.FC<PrivateEventsPageProps> = () => {
  const [formData, setFormData] = useState({
    eventType: 'Corporate VIP Soiree',
    name: '',
    phone: '',
    email: '',
    date: new Date().toISOString().split('T')[0],
    guestCount: 20,
    preferredSeating: 'Private Room' as SeatingPreference,
    budgetRange: 'Rs. 150,000 – Rs. 300,000',
    specialRequirements: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [submittedInquiry, setSubmittedInquiry] = useState<PrivateEventInquiry | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await reservationService.submitPrivateEventInquiry(formData);
    setSubmittedInquiry(res);
    setLoading(false);
  };

  return (
    <div id="private-events-page" className="pt-24 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#d4af37] font-semibold">
          EXCLUSIVE CELEBRATIONS
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold font-serif-luxury text-white">
          Private Events
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400">
          Host corporate galas, private lounge buyouts, and executive celebrations at NOIR.
        </p>
      </div>

      {submittedInquiry ? (
        <div className="bg-[#121216] border border-[#d4af37]/40 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl animate-fadeIn">
          <div className="w-16 h-16 rounded-full bg-[#d4af37]/20 border border-[#d4af37] flex items-center justify-center text-[#d4af37] mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#d4af37] font-bold">
              INQUIRY RECEIVED #{submittedInquiry.id}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-white">
              Event Concierge Assigned
            </h2>
            <p className="text-xs text-neutral-300 max-w-md mx-auto">
              Our Senior Event Specialist will contact <strong className="text-white">{submittedInquiry.name}</strong> within 4 business hours to finalize bespoke arrangements.
            </p>
          </div>

          <button
            onClick={() => setSubmittedInquiry(null)}
            className="px-8 py-3 rounded-full bg-gradient-to-r from-[#d4af37] to-[#aa820a] text-[#0a0a0c] font-bold text-xs uppercase tracking-widest"
          >
            Submit Another Inquiry
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-[#121216] border border-neutral-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6 glass-panel"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] uppercase tracking-wider text-neutral-400 block mb-1">
                Event Type
              </label>
              <select
                value={formData.eventType}
                onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                className="w-full bg-[#0a0a0c] border border-neutral-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
              >
                <option>Corporate VIP Soiree</option>
                <option>Private Lounge Buyout</option>
                <option>Birthday Gala Celebration</option>
                <option>Executive Networking Night</option>
                <option>Custom VIP Gathering</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] uppercase tracking-wider text-neutral-400 block mb-1">
                Organizer Name
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
                Phone Number
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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

            <div>
              <label className="text-[11px] uppercase tracking-wider text-neutral-400 block mb-1">
                Target Event Date
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full bg-[#0a0a0c] border border-neutral-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <div>
              <label className="text-[11px] uppercase tracking-wider text-neutral-400 block mb-1">
                Estimated Guest Count
              </label>
              <input
                type="number"
                min="5"
                max="150"
                value={formData.guestCount}
                onChange={(e) => setFormData({ ...formData, guestCount: parseInt(e.target.value) || 5 })}
                className="w-full bg-[#0a0a0c] border border-neutral-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] uppercase tracking-wider text-neutral-400 block mb-1">
              Budget Target (PKR)
            </label>
            <select
              value={formData.budgetRange}
              onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
              className="w-full bg-[#0a0a0c] border border-neutral-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
            >
              <option>Rs. 100,000 – Rs. 200,000</option>
              <option>Rs. 200,000 – Rs. 500,000</option>
              <option>Rs. 500,000 – Rs. 1,000,000</option>
              <option>Rs. 1,000,000+ Full Buyout</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] uppercase tracking-wider text-neutral-400 block mb-1">
              Event Details & Catering / DJ Requirements
            </label>
            <textarea
              rows={4}
              placeholder="Describe your vision for the event..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full bg-[#0a0a0c] border border-neutral-700 rounded-xl p-3 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#d4af37]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-[#d4af37] via-[#e6c687] to-[#aa820a] text-[#0a0a0c] font-bold text-xs uppercase tracking-widest rounded-xl shadow-xl hover:brightness-110 transition disabled:opacity-50"
          >
            {loading ? 'Submitting Inquiry...' : 'Request Private Event'}
          </button>
        </form>
      )}
    </div>
  );
};
