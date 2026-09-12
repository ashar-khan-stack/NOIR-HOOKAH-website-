import React from 'react';
import { PageRoute } from '../types';
import { ShieldAlert, FileText, Lock } from 'lucide-react';

interface LegalPageProps {
  type: 'privacy' | 'terms';
  onNavigate: (page: PageRoute) => void;
}

export const LegalPage: React.FC<LegalPageProps> = ({ type }) => {
  return (
    <div id="legal-page" className="pt-24 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-neutral-300 text-xs sm:text-sm leading-relaxed">
      <div className="bg-[#d4af37]/10 border border-[#d4af37]/40 rounded-2xl p-4 flex items-center gap-3 text-xs text-[#f7e7ce]">
        <ShieldAlert className="w-5 h-5 text-[#d4af37] shrink-0" />
        <div>
          <strong className="text-white block uppercase tracking-wider">Age Requirement & Compliance Warning</strong>
          NOIR HOOKAH is an exclusive adult lounge. Admission and tobacco product sales are strictly restricted to individuals aged 18+ (or legal adult smoking age). Valid photo identification is required upon entry.
        </div>
      </div>

      <div className="bg-[#121216] border border-neutral-800 rounded-3xl p-8 space-y-6">
        <h1 className="text-3xl font-bold font-serif-luxury text-white">
          {type === 'privacy' ? 'Privacy Policy' : 'Terms & Conditions of Service'}
        </h1>

        {type === 'privacy' ? (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-white">1. Information Collection</h2>
            <p>
              We collect information provided directly by you when reserving tables, creating a VIP account, or subscribing to our newsletters.
            </p>
            <h2 className="text-base font-bold text-white">2. Push Notifications & Marketing</h2>
            <p>
              Push notifications and email newsletters are strictly opt-in. You may opt out at any time in App Preferences.
            </p>
            <h2 className="text-base font-bold text-white">3. Data Security</h2>
            <p>
              Your contact details and payment logs are encrypted using industry-standard SSL encryption.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-white">1. Reservation Policies</h2>
            <p>
              Table reservations are held for up to 15 minutes past the reserved time slot. Late arrivals may be reassigned.
            </p>
            <h2 className="text-base font-bold text-white">2. Dress Code & VIP Etiquette</h2>
            <p>
              Smart casual or VIP formal attire is required. Management reserves the right to deny admission.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
