import React, { useState, useEffect } from 'react';
import { Sidebar, NavTab } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Dashboard } from './pages/Dashboard';
import { CreateQuotation } from './pages/CreateQuotation';
import { QuotationHistory } from './pages/QuotationHistory';
import { QuotationPreview } from './pages/QuotationPreview';
import { MasterPricing } from './pages/MasterPricing';
import { Settings } from './pages/Settings';

import { pricingService } from './services/pricingService';
import { quotationService } from './services/quotationService';
import { settingsService } from './services/settingsService';
import { storageService } from './services/storageService';

import { MasterPricingCatalog } from './types/pricing';
import { Quotation, QuotationStatus } from './types/quotation';
import { CompanySettings } from './types/settings';

export const App: React.FC = () => {
  // Navigation State
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');

  // Core Data States
  const [catalog, setCatalog] = useState<MasterPricingCatalog>(() => pricingService.getCatalog());
  const [quotations, setQuotations] = useState<Quotation[]>(() => quotationService.getQuotations());
  const [settings, setSettings] = useState<CompanySettings>(() => settingsService.getSettings());

  // Active Context States
  const [activeQuotation, setActiveQuotation] = useState<Quotation | null>(null);
  const [editingQuotation, setEditingQuotation] = useState<Quotation | null>(null);

  // Sync catalog updates
  const handleUpdateCatalog = (newCatalog: MasterPricingCatalog) => {
    pricingService.saveCatalog(newCatalog);
    setCatalog(newCatalog);
  };

  const handleResetCatalog = () => {
    const fresh = pricingService.resetToDefault();
    setCatalog(fresh);
  };

  // Sync quotation updates
  const handleSaveQuotation = (quotation: Quotation) => {
    const saved = quotationService.saveQuotation(quotation);
    setQuotations(quotationService.getQuotations());
    setActiveQuotation(saved);
  };

  const handleUpdateQuotationStatus = (id: string, status: QuotationStatus) => {
    quotationService.updateStatus(id, status);
    setQuotations(quotationService.getQuotations());
  };

  const handleDuplicateQuotation = (id: string) => {
    const duplicated = quotationService.duplicateQuotation(id);
    if (duplicated) {
      setQuotations(quotationService.getQuotations());
      setEditingQuotation(duplicated);
      setCurrentTab('create');
    }
  };

  const handleDeleteQuotation = (id: string) => {
    quotationService.deleteQuotation(id);
    setQuotations(quotationService.getQuotations());
  };

  // Navigation handlers
  const handlePreviewQuotation = (quotation: Quotation) => {
    setActiveQuotation(quotation);
    setCurrentTab('preview');
  };

  const handleEditQuotation = (quotation: Quotation) => {
    setEditingQuotation(quotation);
    setCurrentTab('create');
  };

  const handleNewQuotation = () => {
    setEditingQuotation(null);
    setCurrentTab('create');
  };

  const handleSaveSettings = (newSettings: CompanySettings) => {
    settingsService.saveSettings(newSettings);
    setSettings(newSettings);
  };

  const handleResetAllData = () => {
    storageService.clearAll();
    setCatalog(pricingService.getCatalog());
    setQuotations(quotationService.getQuotations());
    setSettings(settingsService.getSettings());
    setEditingQuotation(null);
    setActiveQuotation(null);
    setCurrentTab('dashboard');
    alert('All data reset to studio defaults.');
  };

  const draftCount = quotations.filter((q) => q.status === 'draft').length;

  return (
    <div className="flex min-h-screen bg-stone-warm">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          if (tab === 'create' && currentTab !== 'create') {
            setEditingQuotation(null); // Fresh proposal if clicking + New
          }
          setCurrentTab(tab);
        }}
        quotationCount={quotations.length}
        draftCount={draftCount}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          currentTab={currentTab}
          onNavigate={(tab) => {
            if (tab === 'create') setEditingQuotation(null);
            setCurrentTab(tab);
          }}
          globalBaseRate={catalog.globalBaseRate}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {currentTab === 'dashboard' && (
            <Dashboard
              quotations={quotations}
              catalog={catalog}
              onNavigateCreate={handleNewQuotation}
              onNavigateHistory={() => setCurrentTab('history')}
              onNavigatePricing={() => setCurrentTab('pricing')}
              onViewQuotation={(q) => handlePreviewQuotation(q)}
            />
          )}

          {currentTab === 'create' && (
            <CreateQuotation
              catalog={catalog}
              onSaveQuotation={handleSaveQuotation}
              onPreviewQuotation={handlePreviewQuotation}
              editingQuotation={editingQuotation}
              onCancelEdit={() => {
                setEditingQuotation(null);
                setCurrentTab('history');
              }}
              existingQuotationsCount={quotations.length}
            />
          )}

          {currentTab === 'history' && (
            <QuotationHistory
              quotations={quotations}
              onViewQuotation={handlePreviewQuotation}
              onEditQuotation={handleEditQuotation}
              onDuplicateQuotation={handleDuplicateQuotation}
              onDeleteQuotation={handleDeleteQuotation}
              onUpdateStatus={handleUpdateQuotationStatus}
              onNewQuotation={handleNewQuotation}
            />
          )}

          {currentTab === 'preview' && (
            <QuotationPreview
              quotation={activeQuotation || quotations[0]}
              settings={settings}
              onBackToEdit={() => {
                if (activeQuotation) {
                  setEditingQuotation(activeQuotation);
                }
                setCurrentTab('create');
              }}
              onSaveQuotation={handleSaveQuotation}
              onGoToHistory={() => setCurrentTab('history')}
            />
          )}

          {currentTab === 'pricing' && (
            <MasterPricing
              catalog={catalog}
              onUpdateCatalog={handleUpdateCatalog}
              onResetCatalog={handleResetCatalog}
            />
          )}

          {currentTab === 'settings' && (
            <Settings
              settings={settings}
              onSaveSettings={handleSaveSettings}
              onResetSettings={() => setSettings(settingsService.resetToDefault())}
              onResetAllData={handleResetAllData}
            />
          )}
        </main>
      </div>
    </div>
  );
};
