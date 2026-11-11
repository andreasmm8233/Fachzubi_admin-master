import { request } from "../api";
import { ErrorResult, SuccessResult } from "../runtimeType";

// A plan on the pricing page of the website (/preise)
export interface PricingPlanInput {
  name: string;
  description: string;
  price: number;
  duration: "month" | "year";
  features: string[];
  sortOrder: number;
  highlighted: boolean;
  priceNote: string;
  buttonText: string;
  badgeText: string;
}

export interface PricingPlan extends PricingPlanInput {
  _id: string;
}

export const getPricingPlans = async (): Promise<
  SuccessResult<PricingPlan[]> | ErrorResult
> => {
  return request({ url: "/pricing/", method: "get" });
};

export const addPricingPlan = async (
  plan: PricingPlanInput
): Promise<SuccessResult<PricingPlan> | ErrorResult> => {
  return request({ url: "/pricing/", method: "post", data: plan });
};

export const updatePricingPlan = async (
  id: string,
  plan: PricingPlanInput
): Promise<SuccessResult<PricingPlan> | ErrorResult> => {
  return request({ url: `/pricing/${id}`, method: "put", data: plan });
};

export const deletePricingPlan = async (
  id: string
): Promise<SuccessResult<PricingPlan> | ErrorResult> => {
  return request({ url: `/pricing/${id}`, method: "delete" });
};
