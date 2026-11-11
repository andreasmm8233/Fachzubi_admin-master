export interface Employer {
  industryName: string;
  contactPerson: string;
  jobTitle: string;
  companyName: string;
  email: string;
  website: string;
  phoneNo: string;
  address: string;
  zipCode: string;
  companyLogo: string;
  companyDescription: string;
  city: string;
  status: boolean;
  isDeleted: boolean;
  qrCode?: string;
  qrTargetUrl?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  _id: string;
}
export type industriesType = {
  _id: string;
};
export type CityTypeForGetDetail = {
  _id: string;
};
export type EmployerWithIndustriesTypeAndId = {
  industryName: {id:string, label:string};
  id: string;
  date: string;
  companyName: string;
  email: string;
  contactPerson: string;
  city: {id:string, label:string};
  status: string;
  createdAt: string;
  jobTitle: string;
  website: string;
  address: string;
  zipCode: string;
  companyDescription: string;
  phoneNo: string;
  videoLink: string[];
  companyLogo: { _id: string } | any;
  companyImages?: any;
  removedFile?: any;
  companyDocuments?: File[];
  removedDocuments?: string[];
  // region?: { id: string; label: string }; // REGION FEATURE DISABLED
};
// A PDF / Word file already saved for a company
export interface CompanyDocumentFile {
  documentId: string;
  fileName: string;
  path: string;
  type?: string;
}
export interface EmployerFormType {
  industryName: {id:string, label:string};
  contactPerson: string;
  jobTitle: string;
  companyName: string;
  email: string;
  website: string;
  phoneNo: string;
  address: string;
  zipCode: string;
  city: {id:string, label:string};
  companyLogo: File | null;
  videoLink: string[];
  companyDescription: string;
  companyImages?: any;
  removedFile?: any;
  companyDocuments?: File[];
  removedDocuments?: string[];
  // region?: { id: string; label: string }; // REGION FEATURE DISABLED
}
