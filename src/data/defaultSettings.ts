import { CompanySettings } from '../types/settings';

export const DEFAULT_SETTINGS: CompanySettings = {
  companyName: 'Blue Craft Design Studio',
  tagline: 'Interior Design & Turnkey Solutions',
  phone: '+91 98869 33999',
  email: 'projects@bluecraftdesignstudio.com',
  website: 'www.bluecraftdesignstudio.com',
  addressLine1: 'Club Circle, 754/1, 19th Main, 22nd Cross Rd',
  addressLine2: 'Sector 2, HSR Layout',
  city: 'Bengaluru',
  state: 'Karnataka',
  pincode: '560102',
  gstin: '29AABCB1234D1Z8',
  pan: 'AABCB1234D',
  defaultValidityDays: 15,
  defaultGstPercent: 18,
  enableGstByDefault: false,
  termsAndConditions: [
    'Quotation is valid for 15 days from the date of issuance.',
    'Civil modifications, structural changes, plumbing, and major electrical rerouting will be billed per actual site conditions.',
    'Material supply and production will commence strictly upon clearance of the initial advance payment.',
    'Standard execution timeline is 45 working days from finalized 3D shop drawings approval.',
    'All hardware used is certified premium grade (Hettich / Hafele / Blum or equivalent as approved).',
    'Any custom modifications requested post design freeze will incur additional cost and timeline revisions.'
  ],
  paymentMilestones: [
    { percentage: 10, stage: 'Booking Advance & 3D Design Approval' },
    { percentage: 40, stage: 'Production Kickoff & Factory Sourcing' },
    { percentage: 40, stage: 'Dispatch of Modular Units to Site' },
    { percentage: 10, stage: 'Final Handover & Deep Clean Inspection' }
  ]
};
