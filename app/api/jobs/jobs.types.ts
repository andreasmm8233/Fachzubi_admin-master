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
}
export interface getAllJobsType {
  searchValue: string;
  pageNo: number;
  filter: string;
  recordPerPage: string;
}
export interface JobWithCount {
  data: Job[];
  count: number;
}
export interface UpdateJob {
  city?: {id:string, label:string};
  industryName?: { id: string; label: string }
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
}
