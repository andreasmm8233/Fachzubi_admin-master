import { Region, TransformRegion } from "./regions.types";

export const transformRegions = (
  regions: Region[]
): TransformRegion[] => {
  return regions.map((region) => ({
    id: region._id,
    name: region.regionName,
  }));
};
