import React from 'react';
import { CustomerDetails } from '../../types/customer';
import { User, Phone, Mail, MapPin, Building, Calendar, Hash } from 'lucide-react';

interface CustomerDetailsFormProps {
  customer: CustomerDetails;
  onChange: (updated: Partial<CustomerDetails>) => void;
  errors?: Record<string, string>;
}

export const CustomerDetailsForm: React.FC<CustomerDetailsFormProps> = ({
  customer,
  onChange,
  errors = {},
}) => {
  return (
    <div className="bg-white rounded-2xl border border-stone-border/80 p-5 lg:p-6 shadow-card">
      <div className="flex items-center justify-between pb-4 border-b border-stone-border/70 mb-5">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-accent-gold" />
          <h2 className="text-base font-bold font-serif text-brand-950">
            Customer & Project Specifications
          </h2>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-stone-100 text-slate-700 text-xs font-mono font-semibold">
          <Hash className="w-3.5 h-3.5 text-accent-gold" />
          <span>{customer.referenceNumber}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Customer Name */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
            Customer Name <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="e.g. Rohit & Ananya Sharma"
              value={customer.customerName}
              onChange={(e) => onChange({ customerName: e.target.value })}
              className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm font-medium text-brand-950 transition focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-900/20 ${
                errors.customerName
                  ? 'border-rose-400 bg-rose-50/40'
                  : 'border-stone-border bg-stone-warm/50 focus:border-brand-900'
              }`}
            />
          </div>
          {errors.customerName && (
            <p className="text-[11px] text-rose-500 mt-1">{errors.customerName}</p>
          )}
        </div>

        {/* Contact Number */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
            Contact Number <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="tel"
              placeholder="e.g. +91 98450 12345"
              value={customer.contactNumber}
              onChange={(e) => onChange({ contactNumber: e.target.value })}
              className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm font-medium text-brand-950 transition focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-900/20 ${
                errors.contactNumber
                  ? 'border-rose-400 bg-rose-50/40'
                  : 'border-stone-border bg-stone-warm/50 focus:border-brand-900'
              }`}
            />
          </div>
          {errors.contactNumber && (
            <p className="text-[11px] text-rose-500 mt-1">{errors.contactNumber}</p>
          )}
        </div>

        {/* Email Address */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
            Email Address <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              placeholder="e.g. client@example.com"
              value={customer.email}
              onChange={(e) => onChange({ email: e.target.value })}
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-border bg-stone-warm/50 text-sm font-medium text-brand-950 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-900/20 focus:border-brand-900"
            />
          </div>
        </div>

        {/* Project Name */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
            Project / Apartment Name <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="e.g. Prestige Lavender Villa 402"
              value={customer.projectName}
              onChange={(e) => onChange({ projectName: e.target.value })}
              className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm font-medium text-brand-950 transition focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-900/20 ${
                errors.projectName
                  ? 'border-rose-400 bg-rose-50/40'
                  : 'border-stone-border bg-stone-warm/50 focus:border-brand-900'
              }`}
            />
          </div>
          {errors.projectName && (
            <p className="text-[11px] text-rose-500 mt-1">{errors.projectName}</p>
          )}
        </div>

        {/* Project Location */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
            Project Location <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="e.g. Whitefield, Bengaluru"
              value={customer.projectLocation}
              onChange={(e) => onChange({ projectLocation: e.target.value })}
              className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm font-medium text-brand-950 transition focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-900/20 ${
                errors.projectLocation
                  ? 'border-rose-400 bg-rose-50/40'
                  : 'border-stone-border bg-stone-warm/50 focus:border-brand-900'
              }`}
            />
          </div>
          {errors.projectLocation && (
            <p className="text-[11px] text-rose-500 mt-1">{errors.projectLocation}</p>
          )}
        </div>

        {/* Quotation Date */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
            Quotation Date
          </label>
          <div className="relative">
            <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="date"
              value={customer.quotationDate}
              onChange={(e) => onChange({ quotationDate: e.target.value })}
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-border bg-stone-warm/50 text-sm font-medium text-brand-950 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-900/20 focus:border-brand-900"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
