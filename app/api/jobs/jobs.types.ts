export interface Job {
  city: string;
  company: string;
  jobTitle: string;
  count:string;
  startDate: string;
  email: string;
  additionalEmail: string;
  address: string;
  zipCode: string;
  jobDescription: string;
  status: string;
  _id?: string;
  id?: string;
  createdAt: string;
  industryName: string;
  region?: string;
}
export interface getAllJobsType {
  searchValue: string;
  pageNo: number;
  filter: string;
  recordPerPage: string;
  letter?: string;
  region?: string;
  slectedCity?: string;
}
export interface JobWithCount {
  data: Job[];
  count: number;
  total?: number;
  totalPages?: number;
  pageNo?: number;
  recordPerPage?: number;
}
export interface UpdateJob {
  city?: {id:string, label:string};
  industryName?: any;
  company?: { id: string; label: string };
  jobTitle?: string;
  startDate?: string;
  email?: string;
  additionalEmail?: string;
  address?: string;
  zipCode?: string;
  attachments?: any;
  deletedAttachment?:string[];
  jobDescription?: string;
  status?: boolean;
  id: string;
  region?: { id: string; label: string };
  jobType?: any;
}
