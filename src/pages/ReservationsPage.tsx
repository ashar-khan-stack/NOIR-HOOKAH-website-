import React, { useState } from 'react';
import { PageRoute, SeatingPreference, Reservation } from '../types';
import { reservationService } from '../services/reservationService';
import { notificationService } from '../services/notificationService';
import { analytics } from '../services/analyticsService';
import { Calendar, Clock, Users, User, Phone, Mail, CheckCircle2, Sparkles, MessageSquare } from 'lucide-react';

interface ReservationsPageProps {
  onNavigate: (page: PageRoute) => void;
}

export const ReservationsPage: React.FC<ReservationsPageProps> = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    date: new Date().toISOString().split('T')[0],
    time: '09:00 PM',
    guests: 2,
    seatingPreference: 'VIP' as SeatingPreference,
    specialRequest: '',
  });

  const [loading, setLoading] = useState(false);
  const [confirmedReservation, setConfirmedReservation] = useState<Reservation | null>(null);

  const seatingOptions: { label: SeatingPreference; desc: string }[] = [
    { label: 'Standard', desc: 'Main lounge table' },
    { label: 'Premium', desc: 'Elevated plush booth' },
    { label: 'VIP', desc: 'VIP host table with priority' },
    { label: 'Private Room', desc: 'Sound-isolated VIP chamber' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    analytics.trackReservationStart();

    const res = await reservationService.createReservation(formData);
    setConfirmedReservation(res);
    setLoading(false);

    analytics.trackReservationComplete(res.id, res.guests, res.seatingPreference);
    notificationService.pushLocalNotification(
      'Table Reservation Confirmed',
      `Your ${res.seatingPreference} table for ${res.guests} on ${res.date} at ${res.time} is reserved.`,
      'reservation'
    );
  };

  return (
    <div id="reservations-page" className="pt-24 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#d4af37] font-semibold">
          TABLE BOOKING PORTAL
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold font-serif-luxury text-white">
          Reserve a Table
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400">
          Secure your priority seating at NOIR HOOKAH for an unforgettable night.
        </p>
      </div>

      {confirmedReservation ? (
        /* Confirmation State */
        <div className="bg-[#121216] border border-[#d4af37]/40 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl animate-fadeIn">
          <div className="w-16 h-16 rounded-full bg-[#d4af37]/20 border border-[#d4af37] flex items-center justify-center text-[#d4af37] mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#d4af37] font-bold">
              RESERVATION CONFIRMED #{confirmedReservation.id}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-white">
              We Await Your Arrival
            </h2>
            <p className="text-xs text-neutral-300 max-w-md mx-auto">
              Thank you, <strong className="text-white">{confirmedReservation.name}</strong>. A confirmation SMS and email summary has been dispatched.
            </p>
          </div>

          <div className="max-w-md mx-auto bg-[#0a0a0c] border border-neutral-800 rounded-2xl p-5 text-xs text-neutral-300 space-y-2 text-left">
            <div className="flex justify-between">
              <span className="text-neutral-500">Date & Time:</span>
              <span className="font-semibold text-white">{confirmedReservation.date} at {confirmedReservation.time}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Guest Count:</span>
              <span className="font-semibold text-white">{confirmedReservation.guests} Guests</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Seating Area:</span>
              <span className="font-semibold text-[#f7e7ce]">{confirmedReservation.seatingPreference}</span>
            </div>
            {confirmedReservation.specialRequest && (
              <div className="pt-2 border-t border-neutral-800 text-[11px]">
                <span className="text-neutral-500">Note:</span> {confirmedReservation.specialRequest}
              </div>
            )}
          </div>

          <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => onNavigate('menu')}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-[#d4af37] to-[#aa820a] text-[#0a0a0c] font-bold text-xs uppercase tracking-widest shadow-lg"
            >
              Browse Menu & Pre-Order
            </button>
            <button
              onClick={() => setConfirmedReservation(null)}
              className="px-6 py-3 rounded-full border border-neutral-700 hover:border-white text-xs font-semibold text-white"
            >
              Book Another Table
            </button>
          </div>
        </div>
      ) : (
        /* Reservation Form */
        <form
          onSubmit={handleSubmit}
          className="bg-[#121216] border border-neutral-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 glass-panel"
        >
          {/* Section 1: Guest Details */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d4af37] border-b border-neutral-800 pb-2">
              1. Guest Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-[11px] uppercase tracking-wider text-neutral-400 block mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ahmad Khan"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#0a0a0c] border border-neutral-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider text-neutral-400 block mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                  <input
                    type="tel"
                    required
                    placeholder="+92 300 1234567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-[#0a0a0c] border border-neutral-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider text-neutral-400 block mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="vip@domain.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#0a0a0c] border border-neutral-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Date, Time & Guests */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d4af37] border-b border-neutral-800 pb-2">
              2. Date & Guest Count
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-[11px] uppercase tracking-wider text-neutral-400 block mb-1">
                  Date
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-[#0a0a0c] border border-neutral-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider text-neutral-400 block mb-1">
                  Time Slot
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                  <select
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full bg-[#0a0a0c] border border-neutral-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                  >
                    <option>06:00 PM</option>
                    <option>07:30 PM</option>
                    <option>09:00 PM</option>
                    <option>10:30 PM</option>
                    <option>12:00 AM</option>
                    <option>01:30 AM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider text-neutral-400 block mb-1">
                  Guests
                </label>
                <div className="relative">
                  <Users className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={formData.guests}
                    onChange={(e) => setFormData({ ...formData, guests: parseInt(e.target.value) || 1 })}
                    className="w-full bg-[#0a0a0c] border border-neutral-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Seating Preference */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d4af37] border-b border-neutral-800 pb-2">
              3. Seating Area
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {seatingOptions.map((opt) => (
                <div
                  key={opt.label}
                  onClick={() => setFormData({ ...formData, seatingPreference: opt.label })}
                  className={`p-4 rounded-xl border text-xs cursor-pointer transition ${
                    formData.seatingPreference === opt.label
                      ? 'border-[#d4af37] bg-[#d4af37]/15 text-[#f7e7ce]'
                      : 'border-neutral-800 bg-[#0a0a0c] text-neutral-400 hover:text-white'
                  }`}
                >
                  <div className="font-bold text-white">{opt.label}</div>
                  <div className="text-[11px] text-neutral-400 mt-1">{opt.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Special Requests */}
          <div>
            <label className="text-[11px] uppercase tracking-wider text-neutral-400 block mb-1">
              Special Requests or Tobacco Preference
            </label>
            <div className="relative">
              <MessageSquare className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
              <textarea
                rows={3}
                placeholder="e.g. Birthday setup, preference for Rose Mint hookah, quiet table corner..."
                value={formData.specialRequest}
                onChange={(e) => setFormData({ ...formData, specialRequest: e.target.value })}
                className="w-full bg-[#0a0a0c] border border-neutral-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#d4af37]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-[#d4af37] via-[#e6c687] to-[#aa820a] text-[#0a0a0c] font-bold text-xs uppercase tracking-widest rounded-xl shadow-xl hover:brightness-110 transition disabled:opacity-50"
          >
            {loading ? 'Confirming Reservation...' : 'Reserve My Table'}
          </button>
        </form>
      )}
    </div>
  );
};
