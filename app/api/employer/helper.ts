import { Employer, EmployerWithIndustriesTypeAndId } from "./employer.types";
export interface getAllEmployerType {
  searchValue: string;
  pageNo: number;
  filter: string;
  recordPerPage: string;
}
export interface TransformedRowData {
  id: string;
  date: string;
  companyName: string;
  email: string;
  contact: string;
  industry: string;
  city: string;
  status: string;
}
export interface TransformedRowDataWithCount {
  data: TransformedRowData[];
  count: number;
}
export interface UpdateEmployerType {
  industryName: string;
  jobTitle: string;
  companyName: string;
  email: string;
  website: string;
  phoneNo: string;
  address: string;
  zipCode: string;
  companyLogo: string | any;
  companyDescription: string;
  city: string;
  status: boolean;
  contactPerson: string;
  id?: string;
}
export interface PartialUpdateEmployerType {
  id: string;
  status: boolean;
}

export function transformApiData(apiData: Employer): TransformedRowData {
  const createdAtDate = new Date(apiData.createdAt);
  return {
    id: apiData._id,
    date: createdAtDate.toLocaleDateString(),
    companyName: apiData.companyName,
    email: apiData.email,
    contact: apiData.contactPerson,
    industry: apiData.industryName,
    city: apiData.city,
    status: apiData.status ? "Active" : "Inactive",
  };
}

export type EmployerWithIndustriesResponse = {
  industryName: { _id: string; industryName: string };
  id: string;
  date: string;
  companyName: string;
  email: string;
  contactPerson: string;
  city: { _id: string; name: string };
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
};
export function transFormSignalApiData(
  apiData: EmployerWithIndustriesResponse
) {
  const createdAtDate = new Date(apiData.createdAt);
  return {
    id: apiData?.id || "",
    date: createdAtDate.toLocaleDateString(),
    companyName: apiData.companyName,
    email: apiData.email,
    industryName: {
      id: apiData.industryName?._id,
      label: apiData.industryName?.industryName,
    },
    contactPerson: apiData.contactPerson,
    city: { id: apiData.city?._id, label: apiData?.city?.name },
    status: apiData.status,
    jobTitle: apiData.jobTitle,
    website: apiData.website,
    address: apiData.address,
    zipCode: apiData.zipCode,
    videoLink: apiData.videoLink,
    companyDescription: apiData.companyDescription || "",
    phoneNo: apiData.phoneNo,
    companyLogo: apiData.companyLogo || "",
  };
}
