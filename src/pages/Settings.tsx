import React, { useState } from 'react';
import { CompanySettings } from '../types/settings';
import { 
  Building, 
  Phone, 
  Mail, 
  Globe, 
  MapPin, 
  ShieldCheck, 
  Save, 
  Check, 
  RotateCcw, 
  Download, 
  Upload, 
  Trash2, 
  Plus, 
  Receipt
} from 'lucide-react';
import { storageService } from '../services/storageService';

interface SettingsProps {
  settings: CompanySettings;
  onSaveSettings: (settings: CompanySettings) => void;
  onResetSettings: () => void;
  onResetAllData: () => void;
}

export const Settings: React.FC<SettingsProps> = ({
  settings,
  onSaveSettings,
  onResetSettings,
  onResetAllData,
}) => {
  const [formData, setFormData] = useState<CompanySettings>(settings);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [newTerm, setNewTerm] = useState('');

  const handleChange = (field: keyof CompanySettings, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleAddTerm = () => {
    if (!newTerm.trim()) return;
    setFormData((prev) => ({
      ...prev,
      termsAndConditions: [...prev.termsAndConditions, newTerm.trim()],
    }));
    setNewTerm('');
  };

  const handleRemoveTerm = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      termsAndConditions: prev.termsAndConditions.filter((_, i) => i !== index),
    }));
  };

  // Export full JSON backup
  const handleExportBackup = () => {
    const backupData = {
      pricing: storageService.get('PRICING', null),
      quotations: storageService.get('QUOTATIONS', null),
      settings: storageService.get('SETTINGS', null),
      exportedAt: new Date().toISOString(),
      app: 'Blue Craft Design Studio Quotation Maker',
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `BlueCraft_Backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import JSON backup
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.pricing) storageService.set('PRICING', json.pricing);
        if (json.quotations) storageService.set('QUOTATIONS', json.quotations);
        if (json.settings) {
          storageService.set('SETTINGS', json.settings);
          setFormData(json.settings);
        }
        alert('Data backup imported successfully! Refreshing view...');
        window.location.reload();
      } catch (err) {
        alert('Invalid JSON file format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-serif text-brand-950 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-accent-gold" />
            Studio Configuration & Legal Settings
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure studio contact details, customer contract terms, and backup archives.
          </p>
        </div>

        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-sm self-start sm:self-auto ${
            saveSuccess
              ? 'bg-emerald-600 text-white'
              : 'bg-brand-900 hover:bg-brand-800 text-white'
          }`}
        >
          {saveSuccess ? (
            <>
              <Check className="w-4 h-4" />
              <span>Settings Saved!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4 text-accent-gold" />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Studio Identity Card */}
        <div className="bg-white rounded-2xl border border-stone-border/80 p-5 shadow-card space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-stone-border/70">
            <Building className="w-4 h-4 text-accent-gold" />
            <h3 className="text-sm font-bold font-serif text-brand-950">
              Studio Details & Address (Appears on Quotation Letterhead)
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                Company Name
              </label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => handleChange('companyName', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-stone-border bg-stone-warm/50 text-xs font-medium text-brand-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                Tagline
              </label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => handleChange('tagline', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-stone-border bg-stone-warm/50 text-xs font-medium text-brand-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                Official Phone
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-stone-border bg-stone-warm/50 text-xs font-medium text-brand-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                Contact Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-stone-border bg-stone-warm/50 text-xs font-medium text-brand-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                Website
              </label>
              <input
                type="text"
                value={formData.website}
                onChange={(e) => handleChange('website', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-stone-border bg-stone-warm/50 text-xs font-medium text-brand-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                GSTIN Number
              </label>
              <input
                type="text"
                value={formData.gstin}
                onChange={(e) => handleChange('gstin', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-stone-border bg-stone-warm/50 text-xs font-medium text-brand-950 font-mono focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-900"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                Studio Address
              </label>
              <input
                type="text"
                value={formData.addressLine1}
                onChange={(e) => handleChange('addressLine1', e.target.value)}
                placeholder="Address Line 1"
                className="w-full px-3.5 py-2 rounded-xl border border-stone-border bg-stone-warm/50 text-xs font-medium text-brand-950 mb-2 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-900"
              />
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  placeholder="City"
                  className="px-3 py-1.5 rounded-lg border border-stone-border text-xs"
                />
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => handleChange('state', e.target.value)}
                  placeholder="State"
                  className="px-3 py-1.5 rounded-lg border border-stone-border text-xs"
                />
                <input
                  type="text"
                  value={formData.pincode}
                  onChange={(e) => handleChange('pincode', e.target.value)}
                  placeholder="Pincode"
                  className="px-3 py-1.5 rounded-lg border border-stone-border text-xs font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Terms and Conditions Card */}
        <div className="bg-white rounded-2xl border border-stone-border/80 p-5 shadow-card space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-stone-border/70">
            <ShieldCheck className="w-4 h-4 text-accent-gold" />
            <h3 className="text-sm font-bold font-serif text-brand-950">
              Quotation Terms & Conditions
            </h3>
          </div>

          <div className="space-y-2">
            {formData.termsAndConditions.map((term, idx) => (
              <div
                key={idx}
                className="flex items-start justify-between gap-3 p-2.5 rounded-xl bg-stone-50 border border-stone-border text-xs text-slate-700"
              >
                <div className="flex items-start gap-2">
                  <span className="font-bold text-accent-gold">{idx + 1}.</span>
                  <span>{term}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveTerm(idx)}
                  className="p-1 text-slate-400 hover:text-rose-600 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Add Term */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="text"
              placeholder="Add another contract clause..."
              value={newTerm}
              onChange={(e) => setNewTerm(e.target.value)}
              className="flex-1 px-3.5 py-2 rounded-xl border border-stone-border text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-900"
            />
            <button
              type="button"
              onClick={handleAddTerm}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-brand-950 text-xs font-semibold transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </div>

        {/* Data Persistence & Backup Card */}
        <div className="bg-white rounded-2xl border border-stone-border/80 p-5 shadow-card space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-stone-border/70">
            <Download className="w-4 h-4 text-accent-gold" />
            <h3 className="text-sm font-bold font-serif text-brand-950">
              Data Management & Backup
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Export JSON */}
            <button
              type="button"
              onClick={handleExportBackup}
              className="flex items-center justify-center gap-2 p-3 rounded-xl border border-stone-border bg-stone-50 hover:bg-stone-100 text-xs font-semibold text-slate-700 transition"
            >
              <Download className="w-4 h-4 text-accent-gold" />
              <span>Export JSON Backup</span>
            </button>

            {/* Import JSON */}
            <label className="flex items-center justify-center gap-2 p-3 rounded-xl border border-stone-border bg-stone-50 hover:bg-stone-100 text-xs font-semibold text-slate-700 transition cursor-pointer">
              <Upload className="w-4 h-4 text-accent-gold" />
              <span>Import JSON File</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportBackup}
                className="hidden"
              />
            </label>

            {/* Reset All */}
            <button
              type="button"
              onClick={() => {
                if (
                  window.confirm(
                    'Are you sure you want to reset all mock quotations, pricing catalogs, and settings to original defaults?'
                  )
                ) {
                  onResetAllData();
                }
              }}
              className="flex items-center justify-center gap-2 p-3 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-xs font-semibold text-rose-700 transition"
            >
              <RotateCcw className="w-4 h-4 text-rose-500" />
              <span>Reset All to Defaults</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
