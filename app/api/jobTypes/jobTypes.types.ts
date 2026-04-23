export type TransformJobType = {
  id: string;
  name: string;
};

export type TransformJobTypeForFilters = {
  data: TransformJobType[];
  count: number;
};

export type JobTypes = {
  _id: string;
  jobTypeName: string;
};

export interface getAllJobTypesType {
  searchValue: string;
  pageNo: number;
  recordPerPage: string;
}
