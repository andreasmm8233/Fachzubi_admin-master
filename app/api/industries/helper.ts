import { Industries, TransformIndustry } from "./industries.types";

export const transformIndustries = (
  industries: Industries[]
): TransformIndustry[] => {
  return industries.map((industry) => ({
    id: industry._id,
    name: industry.industryName,
  }));
};
