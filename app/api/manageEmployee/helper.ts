export interface EmployeePermissions {
  manage_jobs: boolean;
  manage_cities: boolean;
  manage_employers: boolean;
  manage_industries: boolean;
  job_types: boolean;
  manage_content: boolean;
}

export interface Employee {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  plainPassword?: string;
  isActive: boolean;
  isDeleted: boolean;
  permissions: EmployeePermissions;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmployeePayload {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirm_password: string;
  permissions?: Partial<EmployeePermissions>;
}

export interface UpdateEmployeePayload {
  id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  isActive?: boolean;
  permissions?: EmployeePermissions;
}

export interface TransformedEmployeeRow {
  id: string;
  name: string;
  email: string;
  password?: string;
  status: string;
  permissions: string;
  createdAt: string;
}

export function transformEmployeeData(apiData: Employee): TransformedEmployeeRow {
  const createdAtDate = new Date(apiData.createdAt);
  const activePermissions = Object.entries(apiData.permissions || {})
    .filter(([, value]) => value)
    .map(([key]) =>
      key
        .replace(/_/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase())
    );

  return {
    id: apiData._id,
    name: `${apiData.first_name} ${apiData.last_name}`,
    email: apiData.email,
    password: apiData.plainPassword || "N/A",
    status: apiData.isActive ? "Active" : "Inactive",
    permissions:
      activePermissions.length > 0 ? activePermissions.join(", ") : "None",
    createdAt: createdAtDate.toLocaleDateString(),
  };
}

export const DEFAULT_PERMISSIONS: EmployeePermissions = {
  manage_jobs: true,
  manage_cities: true,
  manage_employers: true,
  manage_industries: true,
  job_types: true,
  manage_content: true,
};
