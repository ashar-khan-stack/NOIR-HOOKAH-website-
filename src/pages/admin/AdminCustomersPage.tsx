import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../layouts/AdminLayout';
import { firestoreService } from '../../services/firestoreService';
import { User } from '../../types';
import { LuxuryLoading } from '../../components/common/LuxuryLoading';
import {
  Users,
  Search,
  Crown,
  Phone,
  Mail,
  Filter,
  ArrowUpRight,
  ShieldAlert,
} from 'lucide-react';

export const AdminCustomersPage: React.FC = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<'All' | 'Gold VIP' | 'Black VIP' | 'Noir Reserve'>('All');

  useEffect(() => {
    let isMounted = true;
    const fetchCustomers = async () => {
      try {
        const list = await firestoreService.getAdminCustomers();
        if (isMounted) {
          setCustomers(list);
          setLoading(false);
        }
      } catch (err) {
        console.error('[NOIR Admin] Customer fetch error:', err);
        if (isMounted) setLoading(false);
      }
    };
    fetchCustomers();
    return () => {
      isMounted = false;
    };
  }, []);

  const filtered = customers.filter((c) => {
    const nameMatch = (c.name || '').toLowerCase().includes(searchQuery.toLowerCase());
    const emailMatch = (c.email || '').toLowerCase().includes(searchQuery.toLowerCase());
    const phoneMatch = (c.phone || '').includes(searchQuery);
    const tier = c.membershipTier || c.tier || 'Gold VIP';
    const tierMatch = tierFilter === 'All' || tier === tierFilter;
    return (nameMatch || emailMatch || phoneMatch) && tierMatch;
  });

  return (
    <AdminLayout
      title="Member Registry"
      subtitle="Comprehensive directory of registered VIP patrons and privileges"
    >
      <div className="space-y-6 animate-fadeIn">
        {/* Search & Filter Toolbar */}
        <div className="p-4 rounded-2xl bg-[#121216]/90 border border-neutral-800 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0a0a0c] border border-neutral-800 text-xs text-white focus:outline-none focus:border-[#d4af37]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <span className="text-xs text-neutral-400">Tier:</span>
            <select
              value={tierFilter}
              onChange={(e: any) => setTierFilter(e.target.value)}
              className="bg-[#0a0a0c] border border-neutral-800 text-neutral-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-[#d4af37]"
            >
              <option value="All">All Tiers ({customers.length})</option>
              <option value="Gold VIP">Gold VIP</option>
              <option value="Black VIP">Black VIP</option>
              <option value="Noir Reserve">Noir Reserve</option>
            </select>
          </div>
        </div>

        {/* Customer Table / Card View */}
        {loading ? (
          <LuxuryLoading message="Loading Member Registry..." />
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-[#121216] border border-neutral-800 rounded-3xl space-y-3">
            <Users className="w-10 h-10 text-neutral-600 mx-auto" />
            <h3 className="font-serif-luxury font-bold text-white text-base">No Members Found</h3>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto">
              {searchQuery || tierFilter !== 'All'
                ? 'No registered VIP patron matches the specified query or tier filter.'
                : 'No registered customer records are currently stored in the database.'}
            </p>
          </div>
        ) : (
          <div className="bg-[#121216]/90 border border-neutral-800 rounded-3xl overflow-hidden shadow-xl">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-neutral-800 text-neutral-400 uppercase text-[10px] bg-[#0a0a0c]">
                    <th className="py-3 px-4">Member Name</th>
                    <th className="py-3 px-4">Contact Details</th>
                    <th className="py-3 px-4">Membership Tier</th>
                    <th className="py-3 px-4">Loyalty Balance</th>
                    <th className="py-3 px-4">Account Role</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60">
                  {filtered.map((customer) => {
                    const tier = customer.membershipTier || customer.tier || 'Gold VIP';
                    const points = customer.loyaltyPoints ?? 0;
                    return (
                      <tr key={customer.id} className="hover:bg-neutral-900/40 transition">
                        <td className="py-3.5 px-4 font-semibold text-white">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-[#d4af37] font-mono text-[11px] font-bold">
                              {customer.name ? customer.name[0].toUpperCase() : 'M'}
                            </div>
                            <div>
                              <div>{customer.name || 'Anonymous VIP'}</div>
                              <div className="text-[10px] text-neutral-500 font-mono">
                                UID: {customer.id.slice(0, 10)}...
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 space-y-0.5">
                          <div className="flex items-center gap-1 text-neutral-300">
                            <Mail className="w-3 h-3 text-neutral-500" />
                            <span>{customer.email || 'No email registered'}</span>
                          </div>
                          {customer.phone && (
                            <div className="flex items-center gap-1 text-neutral-500 text-[10px]">
                              <Phone className="w-2.5 h-2.5" />
                              <span>{customer.phone}</span>
                            </div>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              tier === 'Noir Reserve'
                                ? 'bg-[#d4af37]/20 border border-[#d4af37]/60 text-[#f7e7ce]'
                                : tier === 'Black VIP'
                                ? 'bg-neutral-800 border border-neutral-700 text-neutral-200'
                                : 'bg-amber-950 border border-amber-800 text-amber-300'
                            }`}
                          >
                            {tier}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-[#d4af37]">
                          {points.toLocaleString()} PTS
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                              customer.role === 'ADMIN'
                                ? 'bg-rose-950 text-rose-300 border border-rose-800'
                                : 'bg-neutral-900 text-neutral-400'
                            }`}
                          >
                            {customer.role || 'USER'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => navigate(`/admin/customers/${customer.id}`)}
                            className="px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-[#d4af37]/50 text-neutral-300 hover:text-white text-xs inline-flex items-center gap-1 transition"
                          >
                            <span>Inspect</span>
                            <ArrowUpRight className="w-3 h-3 text-neutral-500" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Stacked Card View */}
            <div className="md:hidden divide-y divide-neutral-800">
              {filtered.map((customer) => {
                const tier = customer.membershipTier || customer.tier || 'Gold VIP';
                return (
                  <div key={customer.id} className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-bold text-white text-sm">
                          {customer.name || 'Anonymous VIP'}
                        </div>
                        <div className="text-xs text-neutral-400">{customer.email}</div>
                        {customer.phone && (
                          <div className="text-xs text-neutral-500">{customer.phone}</div>
                        )}
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#d4af37]/20 text-[#f7e7ce]">
                        {tier}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1 border-t border-neutral-800/80">
                      <span className="font-mono text-[#d4af37]">
                        {(customer.loyaltyPoints || 0).toLocaleString()} PTS
                      </span>
                      <button
                        onClick={() => navigate(`/admin/customers/${customer.id}`)}
                        className="px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-200 text-xs font-medium"
                      >
                        Inspect Dossier
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
