import { SVG } from "../icon";
export interface SidebarMenu {
  id: number;
  icon?: any;
  label: string;
  url?: string;
  permissionKey?: string; // maps to EmployeePermissions key; undefined = always visible
  adminOnly?: boolean; // if true, only visible to admin role

  children?: {
    id: number;
    label: string;
    url?: string;
  }[];
}
export const MENU_DATA: SidebarMenu[] = [
  {
    id: 1,
    icon: SVG.DashboardIcon,
    label: "Dashboard",
    url: "/dashboard",
    adminOnly: true,
  },
  {
    id: 10,
    icon: SVG.GroupUser,
    label: "Manage Employee",
    url: "/manage-employee",
    adminOnly: true,
  },
  {
    id: 2,
    icon: SVG.GroupUser,
    label: "Manage Employers",
    url: "/manage-employers",
    permissionKey: "manage_employers",
  },
  {
    id: 3,
    icon: SVG.JobsIcon,
    label: "Manage Jobs",
    url: "/manage-jobs",
    permissionKey: "manage_jobs",
  },

  {
    id: 4,
    icon: SVG.Industries,
    label: "Manage Industries",
    url: "/manage-industries",
    permissionKey: "manage_industries",
  },
  {
    id: 5,
    icon: SVG.Industries,
    label: "Job Types",
    url: "/manage-type-of-job",
    permissionKey: "job_types",
  },
  {
    id: 6,
    icon: SVG.CitiesIcon,
    label: "Manage Cities",
    url: "/manage-cities",
    permissionKey: "manage_cities",
  },
  {
    id: 7,
    icon: SVG.ContentIcon,
    label: "Manage Content",
    permissionKey: "manage_content",
    children: [
      {
        id: 1,
        label: "Terms & Conditions",
        url: "terms-and-conditions",
      },
      {
        id: 2,
        label: "Privacy Policy",
        url: "privacy-policy",
      },
      {
        id: 3,
        label: "Job Cover Letter",
        url: "job-cover-letter",
      },
      {
        id: 4,
        label: "Appointment Letter",
        url: "appointment",
      },
      {
        id: 5,
        label: "Landing Page",
        url: "landing-page",
      },
    ],
  },
  {
    id: 8,
    icon: SVG.Setting,
    label: "Admin Settings",
    url: "/admin-setting",
    adminOnly: true,
  },
  {
    id: 9,
    icon: SVG.Logout,
    label: "Log Out",
  },
];
