import { JobTypes, TransformJobType } from "./jobTypes.types";

export const transformJobTypes = (jobTypes: JobTypes[]): TransformJobType[] => {
  return jobTypes.map((jobType) => ({
    id: jobType._id,
    name: jobType.jobTypeName,
  }));
};
