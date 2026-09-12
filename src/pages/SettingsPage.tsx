import React, { useState } from 'react';
import { PageRoute } from '../types';
import { notificationService } from '../services/notificationService';
import { Settings, Moon, Sun, Bell, Shield, Palette, Globe, Check } from 'lucide-react';

interface SettingsPageProps {
  onNavigate: (page: PageRoute) => void;
  accentColor: string;
  onSelectAccentColor: (color: string) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  onNavigate,
  accentColor,
  onSelectAccentColor,
}) => {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  const colors = [
    { name: 'Champagne Gold', code: '#d4af37' },
    { name: 'Rose Gold', code: '#b76e79' },
    { name: 'Emerald VIP', code: '#00a86b' },
    { name: 'Midnight Azure', code: '#1a365d' },
    { name: 'Platinum Silver', code: '#e5e4e2' },
  ];

  return (
    <div id="settings-page" className="pt-24 pb-20 max-w-2xl mx-auto px-4 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold font-serif-luxury text-white">App Preferences & Theme</h1>
        <p className="text-xs text-neutral-400">Customize visual accent colors, push alerts, and privacy options.</p>
      </div>

      <div className="bg-[#121216] border border-neutral-800 rounded-3xl p-6 sm:p-8 glass-panel space-y-6">
        {/* Accent Color Selection */}
        <div className="space-y-3">
          <label className="text-xs font-semibold uppercase tracking-wider text-[#d4af37] flex items-center gap-2">
            <Palette className="w-4 h-4" />
            <span>Customizable Luxury Accent Color</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {colors.map((col) => (
              <button
                key={col.code}
                onClick={() => onSelectAccentColor(col.code)}
                className={`p-3 rounded-xl border text-xs flex items-center justify-between transition ${
                  accentColor === col.code
                    ? 'border-[#d4af37] bg-[#d4af37]/15 text-white font-bold'
                    : 'border-neutral-800 bg-[#0a0a0c] text-neutral-400'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-4 h-4 rounded-full border border-neutral-600 shrink-0"
                    style={{ backgroundColor: col.code }}
                  />
                  <span>{col.name}</span>
                </div>
                {accentColor === col.code && <Check className="w-4 h-4 text-[#d4af37]" />}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="pt-4 border-t border-neutral-800 space-y-3">
          <label className="text-xs font-semibold uppercase tracking-wider text-[#d4af37] flex items-center gap-2">
            <Bell className="w-4 h-4" />
            <span>Push Notifications</span>
          </label>

          <div className="flex items-center justify-between p-3 rounded-xl bg-[#0a0a0c] border border-neutral-800 text-xs">
            <div>
              <div className="font-semibold text-white">Lounge Alerts & Flavor Drops</div>
              <div className="text-[11px] text-neutral-400">Receive real-time reservation updates.</div>
            </div>
            <input
              type="checkbox"
              checked={pushEnabled}
              onChange={(e) => {
                setPushEnabled(e.target.checked);
                notificationService.setPushActive(e.target.checked);
              }}
              className="w-4 h-4 accent-[#d4af37]"
            />
          </div>
        </div>

        {/* Legal Links */}
        <div className="pt-4 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
          <button onClick={() => onNavigate('privacy')} className="hover:text-white">
            Privacy Policy
          </button>
          <button onClick={() => onNavigate('terms')} className="hover:text-white">
            Terms & Conditions
          </button>
        </div>
      </div>
    </div>
  );
};
