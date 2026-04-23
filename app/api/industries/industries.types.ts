export type TransformIndustry = {
  id: string;
  name: string;
};
export type TransformIndustryForFilters = {
  data: TransformIndustry[];
  count: number;
};
export type Industries = {
  _id: string;
  industryName: string;
};
export interface getAllIndustriesType {
  searchValue: string;
  pageNo: number;
  recordPerPage: string;
}
