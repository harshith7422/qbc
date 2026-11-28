import React, { useState } from 'react';
import { CompanySettings, MaterialSpec } from '../types/settings';
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
  Receipt,
  ClipboardList,
  CreditCard
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
  const [formData, setFormData] = useState<CompanySettings>({
    ...settings,
    sections: settings.sections ?? [],
    materialSpecifications: settings.materialSpecifications ?? [],
    paymentMilestones: settings.paymentMilestones ?? [],
  });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [newTerm, setNewTerm] = useState('');
  const [sectionInputs, setSectionInputs] = useState<Record<number, string>>({});

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

  // --- Payment Milestones handlers ---
  const handleMilestoneChange = (index: number, field: 'percentage' | 'stage', value: any) => {
    setFormData(prev => ({
      ...prev,
      paymentMilestones: prev.paymentMilestones.map((m, i) =>
        i === index ? { ...m, [field]: field === 'percentage' ? (parseFloat(value) || 0) : value } : m
      ),
    }));
  };

  const handleAddMilestone = () => {
    setFormData(prev => ({
      ...prev,
      paymentMilestones: [
        ...prev.paymentMilestones,
        { percentage: 10, stage: '' }
      ],
    }));
  };

  const handleRemoveMilestone = (index: number) => {
    setFormData(prev => ({
      ...prev,
      paymentMilestones: prev.paymentMilestones.filter((_, i) => i !== index),
    }));
  };

  // --- Material Specifications handlers ---
  const handleMaterialSpecChange = (index: number, field: keyof MaterialSpec, value: string) => {
    setFormData(prev => ({
      ...prev,
      materialSpecifications: prev.materialSpecifications.map((row, i) =>
        i === index ? { ...row, [field]: value } : row
      ),
    }));
  };

  const handleAddMaterialSpec = () => {
    setFormData(prev => ({
      ...prev,
      materialSpecifications: [...prev.materialSpecifications, { description: '', spec: '', brand: '' }],
    }));
  };

  const handleRemoveMaterialSpec = (index: number) => {
    setFormData(prev => ({
      ...prev,
      materialSpecifications: prev.materialSpecifications.filter((_, i) => i !== index),
    }));
  };

  // --- Section handlers ---
  const handleAddSection = () => {
    setFormData(prev => ({
      ...prev,
      sections: [...(prev.sections || []), { title: '', points: [] }],
    }));
  };

  const handleRemoveSection = (sIdx: number) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections?.filter((_, i) => i !== sIdx) || [],
    }));
  };

  const handleSectionTitleChange = (sIdx: number, title: string) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections?.map((sec, i) =>
        i === sIdx ? { ...sec, title } : sec
      ) || [],
    }));
  };

  const handleAddSectionPoint = (sIdx: number, point: string) => {
    if (!point.trim()) return;
    setFormData(prev => ({
      ...prev,
      sections: prev.sections?.map((sec, i) =>
        i === sIdx ? { ...sec, points: [...sec.points, point.trim()] } : sec
      ) || [],
    }));
  };

  const handleRemoveSectionPoint = (sIdx: number, pIdx: number) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections?.map((sec, i) =>
        i === sIdx ? { ...sec, points: sec.points.filter((_, pi) => pi !== pIdx) } : sec
      ) || [],
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
            Studio Configuration &amp; Legal Settings
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
              Studio Details &amp; Address (Appears on Quotation Letterhead)
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

        {/* Payment Schedule & Milestones Card */}
        <div className="bg-white rounded-2xl border border-stone-border/80 p-5 shadow-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-border/70">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-accent-gold" />
              <h3 className="text-sm font-bold font-serif text-brand-950">
                Payment Schedule &amp; Milestones
              </h3>
            </div>
            {/* Total Percentage indicator */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-400 font-medium">Total:</span>
              <span className={`font-mono font-bold px-2 py-0.5 rounded-md ${
                formData.paymentMilestones.reduce((sum, m) => sum + (Number(m.percentage) || 0), 0) === 100
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}>
                {formData.paymentMilestones.reduce((sum, m) => sum + (Number(m.percentage) || 0), 0)}%
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-500">
            Configure the default milestone breakdown shown on customer proposals.
          </p>

          <div className="space-y-2.5">
            {formData.paymentMilestones.map((milestone, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-3 rounded-xl bg-stone-50 border border-stone-border text-xs"
              >
                {/* Milestone Number */}
                <span className="font-bold text-accent-gold w-6 shrink-0 text-center font-mono">
                  #{idx + 1}
                </span>

                {/* Percentage Input */}
                <div className="flex items-center gap-1 shrink-0">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={milestone.percentage}
                    onChange={(e) => handleMilestoneChange(idx, 'percentage', e.target.value)}
                    className="w-16 px-2.5 py-1.5 rounded-lg border border-stone-border bg-white text-xs font-mono font-bold text-brand-950 text-right focus:outline-none focus:ring-1 focus:ring-brand-900"
                  />
                  <span className="text-slate-500 font-bold">%</span>
                </div>

                {/* Stage Description Input */}
                <input
                  type="text"
                  placeholder="e.g. Booking Advance & 3D Design Approval"
                  value={milestone.stage}
                  onChange={(e) => handleMilestoneChange(idx, 'stage', e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-lg border border-stone-border bg-white text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-900"
                />

                {/* Delete Milestone Button */}
                <button
                  type="button"
                  onClick={() => handleRemoveMilestone(idx)}
                  className="p-1 text-slate-400 hover:text-rose-600 transition shrink-0"
                  title="Remove milestone"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Add Milestone Button */}
          <button
            type="button"
            onClick={handleAddMilestone}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-brand-950 text-xs font-semibold transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Milestone Stage</span>
          </button>
        </div>

        {/* Material Specifications Card */}
        <div className="bg-white rounded-2xl border border-stone-border/80 p-5 shadow-card space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-stone-border/70">
            <ClipboardList className="w-4 h-4 text-accent-gold" />
            <h3 className="text-sm font-bold font-serif text-brand-950">
              Material Specifications:
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr>
                  <th className="border border-stone-border bg-yellow-100 px-3 py-2 text-left font-bold text-brand-950 w-[22%]">
                    Description
                  </th>
                  <th className="border border-stone-border bg-yellow-100 px-3 py-2 text-left font-bold text-brand-950 w-[50%]">
                    Spec
                  </th>
                  <th className="border border-stone-border bg-yellow-100 px-3 py-2 text-left font-bold text-brand-950 w-[20%]">
                    Brand
                  </th>
                  <th className="border border-stone-border bg-yellow-100 px-2 py-2 text-center font-bold text-brand-950 w-[8%]">
                  </th>
                </tr>
              </thead>
              <tbody>
                {formData.materialSpecifications.map((row, idx) => (
                  <tr key={idx} className="hover:bg-stone-50 transition">
                    <td className="border border-stone-border px-1 py-1">
                      <input
                        type="text"
                        value={row.description}
                        onChange={(e) => handleMaterialSpecChange(idx, 'description', e.target.value)}
                        className="w-full px-2 py-1.5 text-xs text-brand-950 bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-900 rounded"
                      />
                    </td>
                    <td className="border border-stone-border px-1 py-1">
                      <textarea
                        value={row.spec}
                        onChange={(e) => handleMaterialSpecChange(idx, 'spec', e.target.value)}
                        rows={row.spec.includes('\n') ? 2 : 1}
                        className="w-full px-2 py-1.5 text-xs text-brand-950 bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-900 rounded resize-none"
                      />
                    </td>
                    <td className="border border-stone-border px-1 py-1">
                      <input
                        type="text"
                        value={row.brand}
                        onChange={(e) => handleMaterialSpecChange(idx, 'brand', e.target.value)}
                        className="w-full px-2 py-1.5 text-xs text-brand-950 bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-900 rounded"
                      />
                    </td>
                    <td className="border border-stone-border px-1 py-1 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveMaterialSpec(idx)}
                        className="p-1 text-slate-400 hover:text-rose-600 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add Row */}
          <button
            type="button"
            onClick={handleAddMaterialSpec}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-brand-950 text-xs font-semibold transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Row</span>
          </button>
        </div>

        {/* Terms and Conditions Card */}
        <div className="bg-white rounded-2xl border border-stone-border/80 p-5 shadow-card space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-stone-border/70">
            <ShieldCheck className="w-4 h-4 text-accent-gold" />
            <h3 className="text-sm font-bold font-serif text-brand-950">
              Quotation Terms &amp; Conditions
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

        {/* Dynamic Custom Sections */}
        {formData.sections?.map((section, sIdx) => (
          <div key={sIdx} className="bg-white rounded-2xl border border-stone-border/80 p-5 shadow-card space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-stone-border/70">
              <ShieldCheck className="w-4 h-4 text-accent-gold" />
              <input
                type="text"
                value={section.title}
                onChange={(e) => handleSectionTitleChange(sIdx, e.target.value)}
                placeholder="Section Title (e.g. Payment Terms, Warranty Policy...)"
                className="flex-1 text-sm font-bold font-serif text-brand-950 bg-transparent border-none outline-none placeholder:text-slate-400 placeholder:font-normal"
              />
              <button
                type="button"
                onClick={() => handleRemoveSection(sIdx)}
                className="p-1 text-slate-400 hover:text-rose-600 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2">
              {section.points.map((pt, pIdx) => (
                <div
                  key={pIdx}
                  className="flex items-start justify-between gap-3 p-2.5 rounded-xl bg-stone-50 border border-stone-border text-xs text-slate-700"
                >
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-accent-gold">{pIdx + 1}.</span>
                    <span>{pt}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveSectionPoint(sIdx, pIdx)}
                    className="p-1 text-slate-400 hover:text-rose-600 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
            {/* Add Point */}
            <div className="flex items-center gap-2 pt-2">
              <input
                type="text"
                placeholder="Add another point..."
                value={sectionInputs[sIdx] || ''}
                onChange={(e) => setSectionInputs(prev => ({ ...prev, [sIdx]: e.target.value }))}
                className="flex-1 px-3.5 py-2 rounded-xl border border-stone-border text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-900"
              />
              <button
                type="button"
                onClick={() => {
                  handleAddSectionPoint(sIdx, sectionInputs[sIdx] || '');
                  setSectionInputs(prev => ({ ...prev, [sIdx]: '' }));
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-brand-950 text-xs font-semibold transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>
        ))}

        {/* Add New Section Button */}
        <button
          type="button"
          onClick={handleAddSection}
          className="w-full flex items-center justify-center gap-2 p-3 rounded-2xl border-2 border-dashed border-stone-border/60 bg-stone-50/50 hover:bg-stone-100 text-xs font-semibold text-slate-500 hover:text-brand-950 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Section</span>
        </button>

        {/* Data Persistence &amp; Backup Card */}
        <div className="bg-white rounded-2xl border border-stone-border/80 p-5 shadow-card space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-stone-border/70">
            <Download className="w-4 h-4 text-accent-gold" />
            <h3 className="text-sm font-bold font-serif text-brand-950">
              Data Management &amp; Backup
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
