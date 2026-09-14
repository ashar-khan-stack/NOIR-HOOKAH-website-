import React, { useEffect, useState, useMemo } from 'react';
import { MemberLayout } from '../../layouts/MemberLayout';
import { useAuth } from '../../context/AuthContext';
import { firestoreService } from '../../services/firestoreService';
import { notificationService } from '../../services/notificationService';
import { Reservation, SeatingPreference } from '../../types';
import {
  Calendar,
  Clock,
  Users,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Crown,
  ChevronRight,
  Phone,
  Mail,
  Wind,
} from 'lucide-react';

const SEATING_OPTIONS: { id: SeatingPreference; label: string; desc: string; minSpend?: string }[] = [
  { id: 'Standard', label: 'Standard Lounge', desc: 'Comfortable plush leather seating in our main lounge arena.' },
  { id: 'Premium', label: 'Premium Booth', desc: 'Elevated velvet booth with direct view of crystal chandeliers.' },
  { id: 'VIP', label: 'VIP Chandelier Salon', desc: 'Dedicated butler, complimentary fruit platter & ice tip hose.' },
  { id: 'Private Room', label: 'Private Obsidian Room', desc: 'Soundproof luxury room with 4K display & personalized sommelier.' },
];

const TIME_SLOTS = [
  '06:00 PM',
  '07:00 PM',
  '08:00 PM',
  '09:00 PM',
  '10:00 PM',
  '11:00 PM',
  '12:00 AM',
  '01:00 AM',
  '02:00 AM',
];

export const ReservationsPage: React.FC = () => {
  const { firebaseUser, userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'book' | 'history'>('book');
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [bookingSuccess, setBookingSuccess] = useState<Reservation | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Booking Form State
  const todayStr = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState<string>(todayStr);
  const [time, setTime] = useState<string>('09:00 PM');
  const [guests, setGuests] = useState<number>(4);
  const [seatingPreference, setSeatingPreference] = useState<SeatingPreference>('VIP');
  const [phone, setPhone] = useState<string>(userProfile?.phone || '+92 300 1234567');
  const [preferredHookah, setPreferredHookah] = useState<string>('The Obsidian Crown');
  const [specialRequest, setSpecialRequest] = useState<string>('');

  const currentEmail = firebaseUser?.email || userProfile?.email;
  const currentUid = firebaseUser?.uid;
  const displayName = userProfile?.name || firebaseUser?.displayName || 'VIP Member';

  useEffect(() => {
    if (!currentEmail) {
      setReservations([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    // Realtime snapshot listener
    const unsubscribe = firestoreService.onUserReservationsSnapshot(currentEmail, (list) => {
      setReservations(list);
      setLoading(false);
    });

    // Initial fetch fallback
    firestoreService.getUserReservations(currentEmail).then((res) => {
      setReservations(res);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [currentEmail]);

  const handleBookReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentEmail) {
      setErrorMsg('You must have a verified email to reserve a table.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const payload = {
        name: displayName,
        phone,
        email: currentEmail,
        date,
        time,
        guests: Number(guests),
        seatingPreference,
        specialRequest: specialRequest
          ? `${specialRequest} (Preferred: ${preferredHookah})`
          : `Preferred Hookah: ${preferredHookah}`,
        userId: currentUid,
      };

      const newBooking = await firestoreService.createReservation(payload);
      setBookingSuccess(newBooking);
      setSpecialRequest('');
      notificationService.pushLocalNotification({
        title: 'VIP Reservation Confirmed',
        message: `Booking #${newBooking.id.slice(-6).toUpperCase()} for ${newBooking.guests} guests on ${newBooking.date} at ${newBooking.time} has been registered.`,
        type: 'reservation',
      });
    } catch (err) {
      console.error('[NOIR Reservation] Creation failed:', err);
      setErrorMsg('Unable to book reservation. Please try again or call lounge concierge.');
    } finally {
      setSubmitting(false);
    }
  };

  const { upcoming, past } = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const up: Reservation[] = [];
    const prev: Reservation[] = [];

    reservations.forEach((r) => {
      if (r.date >= today && r.status !== 'Cancelled') {
        up.push(r);
      } else {
        prev.push(r);
      }
    });

    return { upcoming: up, past: prev };
  }, [reservations]);

  return (
    <MemberLayout title="VIP Lounge Reservations" subtitle="Private Booth & Salon Booking">
      <div className="space-y-8 animate-fadeIn">
        {/* Navigation Tabs */}
        <div className="flex border-b border-neutral-800 gap-4">
          <button
            onClick={() => {
              setActiveTab('book');
              setBookingSuccess(null);
            }}
            className={`pb-3 text-xs uppercase tracking-wider font-bold transition flex items-center gap-2 relative ${
              activeTab === 'book'
                ? 'text-[#f7e7ce] border-b-2 border-[#d4af37]'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4 text-[#d4af37]" />
            <span>Book a VIP Table</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`pb-3 text-xs uppercase tracking-wider font-bold transition flex items-center gap-2 relative ${
              activeTab === 'history'
                ? 'text-[#f7e7ce] border-b-2 border-[#d4af37]'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Clock className="w-4 h-4 text-[#d4af37]" />
            <span>My Reservations ({reservations.length})</span>
          </button>
        </div>

        {/* Tab 1: Book VIP Table */}
        {activeTab === 'book' && (
          <div>
            {bookingSuccess ? (
              <div className="max-w-xl mx-auto py-12 px-4 text-center space-y-6 bg-[#121216] border border-[#d4af37]/40 rounded-3xl p-8 shadow-2xl animate-fadeIn">
                <div className="w-16 h-16 rounded-full bg-emerald-950 border border-emerald-700 text-emerald-400 flex items-center justify-center mx-auto shadow-lg">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#d4af37] font-bold">
                    RESERVATION CONFIRMED
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-white">
                    Confirmation #{bookingSuccess.id.slice(-6).toUpperCase()}
                  </h2>
                  <p className="text-xs text-neutral-300 leading-relaxed max-w-sm mx-auto">
                    Your VIP table has been secured. Your table host and sommelier will have your selections prepared upon arrival.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#0a0a0c] border border-neutral-800 text-xs text-neutral-400 space-y-2 text-left">
                  <div className="flex justify-between">
                    <span>Date & Time:</span>
                    <span className="text-white font-semibold">{bookingSuccess.date} at {bookingSuccess.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Party Size:</span>
                    <span className="text-white font-semibold">{bookingSuccess.guests} Guests</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Seating Sector:</span>
                    <span className="text-white font-semibold">{bookingSuccess.seatingPreference}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Primary Contact:</span>
                    <span className="text-white font-semibold">{bookingSuccess.name} ({bookingSuccess.phone})</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                  <button
                    onClick={() => setActiveTab('history')}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa820a] text-black font-bold text-xs uppercase tracking-wider hover:brightness-110 transition"
                  >
                    View in My Reservations
                  </button>
                  <button
                    onClick={() => setBookingSuccess(null)}
                    className="px-6 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white font-semibold text-xs transition"
                  >
                    Book Another Table
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleBookReservation} className="max-w-3xl mx-auto space-y-8 bg-[#121216] border border-neutral-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
                {errorMsg && (
                  <div className="p-4 rounded-2xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="space-y-2">
                  <h3 className="font-serif-luxury font-bold text-xl text-white">Table Booking Parameters</h3>
                  <p className="text-xs text-neutral-400">
                    Tables are reserved exclusively for 2 hours with priority coal service and custom fruit bowls.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                  {/* Date Picker */}
                  <div className="space-y-1.5">
                    <label className="text-neutral-300 font-semibold block">Reservation Date</label>
                    <input
                      type="date"
                      min={todayStr}
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                      className="w-full p-3 rounded-xl bg-[#0a0a0c] border border-neutral-800 text-white focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>

                  {/* Time Slot Picker */}
                  <div className="space-y-1.5">
                    <label className="text-neutral-300 font-semibold block">Preferred Seating Time</label>
                    <select
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full p-3 rounded-xl bg-[#0a0a0c] border border-neutral-800 text-white focus:outline-none focus:border-[#d4af37]"
                    >
                      {TIME_SLOTS.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Guests Counter */}
                  <div className="space-y-1.5">
                    <label className="text-neutral-300 font-semibold block">Number of Guests</label>
                    <select
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                      className="w-full p-3 rounded-xl bg-[#0a0a0c] border border-neutral-800 text-white focus:outline-none focus:border-[#d4af37]"
                    >
                      {[1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20].map((num) => (
                        <option key={num} value={num}>
                          {num} Guest{num > 1 ? 's' : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Contact Phone */}
                  <div className="space-y-1.5">
                    <label className="text-neutral-300 font-semibold block">Contact Phone Number</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+92 300 1234567"
                      required
                      className="w-full p-3 rounded-xl bg-[#0a0a0c] border border-neutral-800 text-white focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>
                </div>

                {/* Seating Preference Selector */}
                <div className="space-y-3">
                  <label className="text-xs font-semibold text-neutral-300 block uppercase tracking-wider">
                    Select Lounge Sector
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {SEATING_OPTIONS.map((seat) => {
                      const isSelected = seatingPreference === seat.id;
                      return (
                        <div
                          key={seat.id}
                          onClick={() => setSeatingPreference(seat.id)}
                          className={`p-4 rounded-2xl border cursor-pointer transition text-xs space-y-1 ${
                            isSelected
                              ? 'bg-[#d4af37]/15 border-[#d4af37] text-white shadow-lg'
                              : 'bg-[#0a0a0c] border-neutral-800 text-neutral-400 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-white text-sm">{seat.label}</span>
                            {isSelected && <Crown className="w-4 h-4 text-[#d4af37]" />}
                          </div>
                          <p className="text-[11px] text-neutral-400">{seat.desc}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Preferred Hookah & Notes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                  <div className="space-y-1.5">
                    <label className="text-neutral-300 font-semibold block">Preferred Hookah Setup</label>
                    <select
                      value={preferredHookah}
                      onChange={(e) => setPreferredHookah(e.target.value)}
                      className="w-full p-3 rounded-xl bg-[#0a0a0c] border border-neutral-800 text-white focus:outline-none focus:border-[#d4af37]"
                    >
                      <option value="The Obsidian Crown">The Obsidian Crown (24K Gold)</option>
                      <option value="Phantom Crystal">Phantom Crystal (Bohemian Clear)</option>
                      <option value="Midnight Velvet">Midnight Velvet (Matte Carbon)</option>
                      <option value="Solaris Gold">Solaris Gold Edition</option>
                      <option value="Surprise Me (Sommelier Choice)">Surprise Me (Sommelier Choice)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-neutral-300 font-semibold block">Special Requests (Optional)</label>
                    <input
                      type="text"
                      value={specialRequest}
                      onChange={(e) => setSpecialRequest(e.target.value)}
                      placeholder="E.g., birthday celebration, quiet corner..."
                      className="w-full p-3 rounded-xl bg-[#0a0a0c] border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#d4af37] to-[#aa820a] hover:brightness-110 disabled:opacity-50 text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl transition"
                >
                  {submitting ? (
                    <span>Securing Table in Lounge Registry...</span>
                  ) : (
                    <>
                      <Calendar className="w-4 h-4" />
                      <span>Confirm VIP Reservation</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        )}

        {/* Tab 2: Reservation History */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            {loading ? (
              <div className="py-20 text-center text-sm text-neutral-500 animate-pulse flex flex-col items-center gap-3">
                <Calendar className="w-8 h-8 text-[#d4af37] animate-spin" />
                <span>Loading your table reservations...</span>
              </div>
            ) : reservations.length === 0 ? (
              <div className="py-20 text-center space-y-4 max-w-md mx-auto bg-[#121216]/60 border border-neutral-800 rounded-3xl p-8">
                <Calendar className="w-12 h-12 text-neutral-600 mx-auto" />
                <h3 className="font-serif-luxury font-bold text-xl text-white">No Reservations Found</h3>
                <p className="text-xs text-neutral-400">
                  You have not made any VIP lounge reservations yet. Reserve your table ahead of time.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setActiveTab('book')}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa820a] text-black font-bold text-xs uppercase tracking-wider hover:brightness-110 transition"
                  >
                    Reserve a VIP Table Now
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Upcoming */}
                {upcoming.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-serif-luxury font-bold text-lg text-white flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#d4af37]" />
                      <span>Upcoming Table Bookings ({upcoming.length})</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {upcoming.map((res) => (
                        <div
                          key={res.id}
                          className="bg-[#121216] border border-[#d4af37]/35 rounded-3xl p-6 space-y-4 shadow-xl relative overflow-hidden"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-xs text-[#d4af37] font-bold">
                              #{res.id.slice(-6).toUpperCase()}
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-[10px] font-bold uppercase">
                              {res.status || 'Confirmed'}
                            </span>
                          </div>

                          <div className="space-y-1">
                            <div className="text-base font-bold font-serif-luxury text-white">
                              {res.date} at {res.time}
                            </div>
                            <div className="text-xs text-neutral-300">
                              {res.seatingPreference} Sector • {res.guests} Guests
                            </div>
                          </div>

                          {res.specialRequest && (
                            <div className="text-[11px] text-neutral-400 p-3 bg-[#0a0a0c] rounded-xl border border-neutral-800/80">
                              {res.specialRequest}
                            </div>
                          )}

                          <div className="text-[10px] text-neutral-500 pt-2 border-t border-neutral-800 flex justify-between items-center">
                            <span>Reserved by: {res.name}</span>
                            <span>Phone: {res.phone}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Past */}
                {past.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-serif-luxury font-bold text-lg text-neutral-400">
                      Previous Reservations ({past.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {past.map((res) => (
                        <div
                          key={res.id}
                          className="bg-[#121216]/60 border border-neutral-800 rounded-3xl p-6 space-y-3 text-neutral-400"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-xs font-semibold">
                              #{res.id.slice(-6).toUpperCase()}
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 text-[10px] font-bold uppercase">
                              {res.status}
                            </span>
                          </div>
                          <div className="text-sm font-semibold text-neutral-300">
                            {res.date} at {res.time}
                          </div>
                          <div className="text-xs">
                            {res.seatingPreference} Sector • {res.guests} Guests
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </MemberLayout>
  );
};
