import { City, TransformCity } from "./city.types";
const convertToAM_PM = (isoTime: Date) => {
  const date = new Date(isoTime);
  const options: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };
  return date.toLocaleTimeString("en-US", options);
};
export const transformCities = (cities: City[]): TransformCity[] => {
  return cities.map((city) => ({
    id: city._id.toString(),
    name: city.name,
    startTime: convertToAM_PM(new Date(city.startTime)),
    endTime: convertToAM_PM(new Date(city.endTime)),
    address: city.address,
    zipCode: city.zipCode,
    directionLink: city.directionLink,
    status: city.status,
    qrCode: city.qrCode,
    qrTargetUrl: city.qrTargetUrl,
  }));
};
