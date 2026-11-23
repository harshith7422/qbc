import React, { useState } from 'react';
import { Quotation } from '../types/quotation';
import { CompanySettings } from '../types/settings';
import { Logo } from '../components/common/Logo';
import { formatINR, numberToWordsINR } from '../utils/formatCurrency';
import { exportElementToPdf } from '../utils/pdfExport';
import { 
  Printer, 
  Download, 
  ArrowLeft, 
  Save, 
  Check, 
  ShieldCheck, 
  Building, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Calendar, 
  FileText
} from 'lucide-react';

interface QuotationPreviewProps {
  quotation: Quotation;
  settings: CompanySettings;
  onBackToEdit: () => void;
  onSaveQuotation: (quotation: Quotation) => void;
  onGoToHistory: () => void;
}

export const QuotationPreview: React.FC<QuotationPreviewProps> = ({
  quotation,
  settings,
  onBackToEdit,
  onSaveQuotation,
  onGoToHistory,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Compute validity date
  const quotationDateObj = new Date(quotation.customer.quotationDate || new Date());
  const validityDateObj = new Date(quotationDateObj);
  validityDateObj.setDate(validityDateObj.getDate() + (quotation.validityDays || 15));
  const validUntilStr = validityDateObj.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const formattedDate = quotationDateObj.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    setIsExporting(true);
    const fileName = `BlueCraft_Quotation_${quotation.referenceNumber}.pdf`;
    await exportElementToPdf('customer-quotation-doc', fileName);
    setIsExporting(false);
  };

  const handleSave = () => {
    onSaveQuotation({
      ...quotation,
      status: 'generated',
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-20">
      {/* Top Action Bar (Hidden on Print) */}
      <div className="no-print bg-white p-4 sm:p-5 rounded-2xl border border-stone-border/80 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left Back & Security Badge */}
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToEdit}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-slate-700 text-xs font-semibold transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Edit</span>
          </button>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Customer-Facing 3-Column Layout (Base Prices Removed)</span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
          <button
            onClick={handleSave}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition border ${
              saveSuccess
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-white hover:bg-stone-100 text-slate-700 border-stone-border'
            }`}
          >
            {saveSuccess ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5 text-slate-500" />
                <span>Save Quotation</span>
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-warm hover:bg-stone-200/80 border border-stone-border text-brand-950 text-xs font-semibold transition shadow-xs"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span>Print</span>
          </button>

          <button
            onClick={handleDownloadPdf}
            disabled={isExporting}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-brand-900 hover:bg-brand-800 text-white text-xs font-bold shadow-sm transition disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5 text-accent-gold" />
            <span>{isExporting ? 'Generating PDF...' : 'Download as PDF'}</span>
          </button>
        </div>
      </div>

      {/* CUSTOMER QUOTATION DOCUMENT (This element is exported to PDF and Printed) */}
      <div
        id="customer-quotation-doc"
        className="print-area bg-white rounded-2xl border border-stone-border/80 shadow-card p-8 sm:p-12 text-slate-800 font-sans"
      >
        {/* Document Header / Company Letterhead */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pb-6 border-b-2 border-brand-900">
          <div>
            <Logo size="lg" variant="dark" />
            <p className="text-xs text-slate-500 mt-2 font-medium max-w-sm">
              {settings.addressLine1}, {settings.addressLine2}, {settings.city}, {settings.state} – {settings.pincode}
            </p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-600 mt-2">
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3 text-accent-gold" />
                {settings.phone}
              </span>
              <span className="flex items-center gap-1">
                <Mail className="w-3 h-3 text-accent-gold" />
                {settings.email}
              </span>
              <span className="flex items-center gap-1">
                <Globe className="w-3 h-3 text-accent-gold" />
                {settings.website}
              </span>
            </div>
            {settings.gstin && (
              <div className="text-[10px] text-slate-400 mt-1 uppercase font-mono">
                GSTIN: {settings.gstin} | PAN: {settings.pan}
              </div>
            )}
          </div>

          {/* Quotation Meta Banner */}
          <div className="text-left sm:text-right bg-stone-warm/80 p-4 rounded-xl border border-stone-border/60 min-w-[220px]">
            <div className="text-[10px] uppercase tracking-widest font-bold text-accent-gold">
              Interior Proposal
            </div>
            <div className="text-xl font-bold font-serif text-brand-950 mt-0.5">
              {quotation.referenceNumber}
            </div>
            <div className="mt-2 pt-2 border-t border-stone-200 text-xs space-y-1 text-slate-600">
              <div className="flex justify-between sm:justify-end gap-2">
                <span className="text-slate-400">Date:</span>
                <span className="font-semibold text-slate-800">{formattedDate}</span>
              </div>
              <div className="flex justify-between sm:justify-end gap-2">
                <span className="text-slate-400">Valid Until:</span>
                <span className="font-semibold text-slate-800">{validUntilStr}</span>
              </div>
              <div className="flex justify-between sm:justify-end gap-2">
                <span className="text-slate-400">Status:</span>
                <span className="font-semibold capitalize text-brand-900">{quotation.status}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Customer & Project Summary Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 mt-6 rounded-xl bg-stone-50 border border-stone-border/70 text-xs">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Client Details
            </span>
            <div className="text-sm font-bold text-brand-950">
              {quotation.customer.customerName}
            </div>
            <div className="text-slate-600 mt-0.5 flex items-center gap-1">
              <Phone className="w-3 h-3 text-slate-400" />
              {quotation.customer.contactNumber}
            </div>
            {quotation.customer.email && (
              <div className="text-slate-600 flex items-center gap-1">
                <Mail className="w-3 h-3 text-slate-400" />
                {quotation.customer.email}
              </div>
            )}
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Project Specification
            </span>
            <div className="text-sm font-bold text-brand-950 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-accent-gold" />
              {quotation.customer.projectName}
            </div>
            <div className="text-slate-600 mt-0.5 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-400" />
              {quotation.customer.projectLocation}
            </div>
            <div className="text-slate-500 text-[11px] mt-0.5">
              Total Scope: {quotation.rooms.length} Interior {quotation.rooms.length === 1 ? 'Room' : 'Rooms'}
            </div>
          </div>
        </div>

        {/* Room-Wise Item Breakdown Table (STRICT 3 COLUMNS) */}
        <div className="mt-8 space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-stone-border">
            <h3 className="text-sm font-bold uppercase tracking-wider text-brand-950">
              Room-Wise Scope of Work & Pricing Schedule
            </h3>
            <span className="text-[11px] text-slate-400">
              All prices inclusive of factory finishing & hardware
            </span>
          </div>

          {quotation.rooms.map((room, roomIdx) => {
            const roomTotal = room.items.reduce((acc, it) => acc + (Number(it.finalPrice) || 0), 0);

            return (
              <div key={room.id} className="avoid-break space-y-2">
                {/* Room Header */}
                <div className="flex items-center justify-between bg-brand-950 text-white px-4 py-2 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-accent-gold font-serif font-bold text-xs">
                      {String(roomIdx + 1).padStart(2, '0')}.
                    </span>
                    <span className="font-serif font-bold text-sm tracking-wide">
                      {room.roomName}
                    </span>
                    <span className="text-xs text-slate-400 font-normal">
                      ({room.roomArea} sq.ft)
                    </span>
                  </div>
                  <div className="text-xs font-mono font-bold text-accent-gold">
                    Subtotal: {formatINR(roomTotal)}
                  </div>
                </div>

                {/* 3-Column Table */}
                <div className="border border-stone-border rounded-lg overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-stone-100 text-slate-700 font-semibold uppercase text-[10px] tracking-wider border-b border-stone-border">
                        <th className="py-2.5 px-4 w-1/3">Category</th>
                        <th className="py-2.5 px-4 w-1/2">Subcategory / Finish</th>
                        <th className="py-2.5 px-4 w-1/4 text-right">Final Price (₹)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {room.items.map((item) => (
                        <tr key={item.id} className="hover:bg-stone-50/50">
                          {/* Column 1 – Category */}
                          <td className="py-3 px-4 font-semibold text-brand-950 align-top">
                            {item.categoryName}
                          </td>

                          {/* Column 2 – Subcategory / Finish */}
                          <td className="py-3 px-4 text-slate-700 align-top">
                            <div className="font-medium text-slate-900">{item.subCategoryName}</div>
                            {item.notes && (
                              <div className="text-[11px] text-slate-500 font-normal mt-0.5">
                                • {item.notes}
                              </div>
                            )}
                          </td>

                          {/* Column 3 – Final Price (₹) */}
                          <td className="py-3 px-4 text-right font-mono font-bold text-sm text-brand-950 align-top">
                            {formatINR(item.finalPrice)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>

        {/* Financial Summary & Grand Total (Strictly customer pricing) */}
        <div className="mt-8 pt-4 border-t-2 border-stone-200 avoid-break">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-stone-warm/80 p-5 rounded-2xl border border-stone-border/80">
            <div>
              <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500 block">
                Total Quotation Valuation
              </span>
              <div className="text-xs text-slate-600 mt-1">
                Amount in Words: <strong className="text-slate-900">{numberToWordsINR(quotation.summary.grandTotal)}</strong>
              </div>
            </div>

            <div className="text-left sm:text-right min-w-[200px]">
              {quotation.summary.taxPercent ? (
                <div className="space-y-1 mb-2 text-xs">
                  <div className="flex justify-between sm:justify-end gap-3 text-slate-500">
                    <span>Base Workmanship:</span>
                    <span className="font-mono font-semibold">{formatINR(quotation.summary.totalFinalPrice)}</span>
                  </div>
                  <div className="flex justify-between sm:justify-end gap-3 text-slate-500">
                    <span>GST (18%):</span>
                    <span className="font-mono font-semibold">{formatINR(quotation.summary.taxAmount)}</span>
                  </div>
                </div>
              ) : null}

              <div className="text-xs uppercase tracking-wider font-bold text-slate-500">
                Grand Total:
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold font-serif text-brand-950 tracking-tight">
                {formatINR(quotation.summary.grandTotal)}
              </div>
            </div>
          </div>
        </div>

        {/* Payment Milestones */}
        <div className="mt-8 pt-6 border-t border-stone-border avoid-break">
          <h4 className="text-xs font-bold uppercase tracking-wider text-brand-950 mb-3">
            Payment Schedule & Milestones
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {settings.paymentMilestones.map((m, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs text-slate-700"
              >
                <div className="font-mono font-bold text-brand-950 text-sm">
                  {m.percentage}%
                </div>
                <div className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                  {m.stage}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Terms & Conditions */}
        <div className="mt-6 pt-6 border-t border-stone-border avoid-break">
          <h4 className="text-xs font-bold uppercase tracking-wider text-brand-950 mb-2">
            Terms & Conditions
          </h4>
          <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-600 leading-relaxed">
            {settings.termsAndConditions.map((term, i) => (
              <li key={i}>{term}</li>
            ))}
          </ol>
        </div>

        {/* Signatures */}
        <div className="mt-12 pt-8 border-t border-stone-border grid grid-cols-2 gap-8 avoid-break">
          <div>
            <div className="h-14 border-b border-dashed border-slate-300"></div>
            <div className="text-xs font-bold text-brand-950 mt-2">
              For Blue Craft Design Studio
            </div>
            <div className="text-[10px] text-slate-400">Authorized Signature & Seal</div>
          </div>

          <div>
            <div className="h-14 border-b border-dashed border-slate-300"></div>
            <div className="text-xs font-bold text-brand-950 mt-2">
              Customer Acceptance
            </div>
            <div className="text-[10px] text-slate-400">Client Signature & Date</div>
          </div>
        </div>
      </div>
    </div>
  );
};
