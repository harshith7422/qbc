export interface MaterialSpec {
  description: string;
  spec: string;
  brand: string;
}

export interface CompanySettings {
  companyName: string;
  tagline: string;
  phone: string;
  email: string;
  website: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  gstin: string;
  pan: string;
  defaultValidityDays: number;
  defaultGstPercent: number;
  enableGstByDefault: boolean;
  materialSpecifications: MaterialSpec[];
  termsAndConditions: string[];
  paymentMilestones: {
    percentage: number;
    stage: string;
  }[];
  sections: { title: string; points: string[] }[];
}
