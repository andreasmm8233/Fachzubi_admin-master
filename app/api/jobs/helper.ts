import { Job } from "./jobs.types";

export const transformJobsData = (rawJobs: any): Job[] => {
  return rawJobs.map((rawJob: any) => {
    let isStartDate = false;
    if (rawJob.startDate) {
      isStartDate = true;
    }
    const createdAtDate = new Date(rawJob.createdAt);
    const newStartingDate = new Date(rawJob.startDate);
    return {
      id: rawJob._id,
      company: rawJob.company,
      jobTitle: rawJob.jobTitle,
      startDate: isStartDate ? newStartingDate.toLocaleDateString() : "",
      email: rawJob.email,
      count: rawJob.count ? rawJob.count.applicationCount : "0",
      additionalEmail: rawJob.additionalEmail,
      address: rawJob.address,
      zipCode: rawJob.zipCode,
      jobDescription: rawJob.jobDescription,
      status: rawJob.status ? "Active" : "Inactive",
      city: rawJob.city,
      date: createdAtDate.toLocaleDateString(),
      createdAt: createdAtDate.toLocaleDateString(),
      industryName: rawJob.industryName,
    };
  });
};
