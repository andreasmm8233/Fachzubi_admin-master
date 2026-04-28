import { EmployeePermissions } from "../manageEmployee/helper";

export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface LoginResponseDto {
  accessToken: string;
  refreshToken: string;
  role: "admin" | "employee";
  permissions: EmployeePermissions;
  employee?: {
    _id: string;
    first_name: string;
    last_name: string;
    email: string;
    isActive: boolean;
    permissions: EmployeePermissions;
  };
}

export interface GetCount {
  jobs: string;
  employer: string;
  application: string;
  appoinment: string;
  title: string;
  id: number;
  count: string;
}
