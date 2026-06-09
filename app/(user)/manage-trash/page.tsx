"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Stack,
  Tabs,
  Tab,
  Dialog,
  Typography,
} from "@mui/material";
import Title from "@/app/components/title.components";
import Filter from "@/app/components/filter";
import CustomTable from "@/app/components/table";
import { useRouter } from "next/navigation";
import { useDebounce } from "@uidotdev/usehooks";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RestoreFromTrashIcon from "@mui/icons-material/RestoreFromTrash";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import {
  getAllDeletedJobs,
  restoreJob,
  hardDeleteJob,
} from "@/app/api/jobs/jobs";
import {
  getAllDeletedEmployers,
  restoreEmployer,
  hardDeleteEmployer,
} from "@/app/api/employer/employer";

const ManageTrash = () => {
  const router = useRouter();

  // Tab State: 0 = Jobs, 1 = Companies
  const [tabValue, setTabValue] = useState(0);

  // Jobs States
  const [jobsData, setJobsData] = useState<any[]>([]);
  const [jobsPageCount, setJobsPageCount] = useState<number>(0);
  const [jobsPageNo, setJobsPageNo] = useState<number>(1);
  const [jobsRecordPerPage, setJobsRecordPerPage] = useState<string>("10");
  const [jobsSearchValue, setJobsSearchValue] = useState<string>("");
  const debouncedJobsSearchValue = useDebounce(jobsSearchValue, 300);
  const [jobsLoading, setJobsLoading] = useState<boolean>(true);

  // Companies States
  const [companiesData, setCompaniesData] = useState<any[]>([]);
  const [companiesPageCount, setCompaniesPageCount] = useState<number>(0);
  const [companiesPageNo, setCompaniesPageNo] = useState<number>(1);
  const [companiesRecordPerPage, setCompaniesRecordPerPage] = useState<string>("10");
  const [companiesSearchValue, setCompaniesSearchValue] = useState<string>("");
  const debouncedCompaniesSearchValue = useDebounce(companiesSearchValue, 300);
  const [companiesLoading, setCompaniesLoading] = useState<boolean>(true);

  // Dialog State
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; type: "job" | "company" } | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch Jobs
  const handleGetDeletedJobs = async () => {
    setJobsLoading(true);
    try {
      const response = await getAllDeletedJobs({
        pageNo: jobsPageNo,
        searchValue: jobsSearchValue,
        filter: "",
        recordPerPage: jobsRecordPerPage,
      });
      if (response.remote === "success") {
        setJobsData(response.data.data.data || response.data.data.jobs || []);
        setJobsPageCount(response.data.data.count || response.data.data.total || 0);
      } else {
        toast.error("Error loading deleted jobs");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error loading deleted jobs");
    } finally {
      setJobsLoading(false);
    }
  };

  // Fetch Companies
  const handleGetDeletedCompanies = async () => {
    setCompaniesLoading(true);
    try {
      const response = await getAllDeletedEmployers({
        pageNo: companiesPageNo,
        searchValue: companiesSearchValue,
        filter: "",
        recordPerPage: companiesRecordPerPage,
      });
      if (response.remote === "success") {
        setCompaniesData(response.data.data.data || response.data.data.employers || []);
        setCompaniesPageCount(response.data.data.count || response.data.data.total || 0);
      } else {
        toast.error("Error loading deleted companies");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error loading deleted companies");
    } finally {
      setCompaniesLoading(false);
    }
  };

  // Restore Job
  const handleRestoreJob = async (id: string) => {
    try {
      const response = await restoreJob(id);
      if (response.remote === "success") {
        toast.success("Job successfully restored!");
        handleGetDeletedJobs();
      } else {
        toast.error("Error restoring job");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error restoring job");
    }
  };

  // Restore Company
  const handleRestoreCompany = async (id: string) => {
    try {
      const response = await restoreEmployer(id);
      if (response.remote === "success") {
        toast.success("Company successfully restored!");
        handleGetDeletedCompanies();
      } else {
        toast.error("Error restoring company");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error restoring company");
    }
  };

  // Hard Delete Confirm Action
  const onConfirmHardDelete = async () => {
    if (!itemToDelete) return;
    setDeleteLoading(true);
    try {
      if (itemToDelete.type === "job") {
        const response = await hardDeleteJob(itemToDelete.id);
        if (response.remote === "success") {
          toast.success("Job permanently deleted!");
          handleGetDeletedJobs();
        } else {
          toast.error("Error permanently deleting job");
        }
      } else {
        const response = await hardDeleteEmployer(itemToDelete.id);
        if (response.remote === "success") {
          toast.success("Company permanently deleted!");
          handleGetDeletedCompanies();
        } else {
          toast.error("Error permanently deleting company");
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Error deleting record");
    } finally {
      setDeleteLoading(false);
      setIsConfirmOpen(false);
      setItemToDelete(null);
    }
  };

  // Open Confirm Dialog
  const triggerHardDelete = (id: string, type: "job" | "company") => {
    setItemToDelete({ id, type });
    setIsConfirmOpen(true);
  };

  // Effects for Jobs
  useEffect(() => {
    if (tabValue === 0) {
      handleGetDeletedJobs();
    }
  }, [jobsPageNo, jobsRecordPerPage, tabValue]);

  useEffect(() => {
    if (tabValue === 0) {
      handleGetDeletedJobs();
    }
  }, [debouncedJobsSearchValue]);

  // Effects for Companies
  useEffect(() => {
    if (tabValue === 1) {
      handleGetDeletedCompanies();
    }
  }, [companiesPageNo, companiesRecordPerPage, tabValue]);

  useEffect(() => {
    if (tabValue === 1) {
      handleGetDeletedCompanies();
    }
  }, [debouncedCompaniesSearchValue]);

  // Handle Tab Switch
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Jobs Column mapping
  const JOB_COLUMNS = [
    { name: "Date", key: "date" },
    { name: "Company Name", key: "company" },
    { name: "Job Title", key: "jobTitle" },
    { name: "City", key: "city" },
    { name: "Action", key: "action" },
  ];

  // Employers Column mapping
  const COMPANY_COLUMNS = [
    { name: "Company Name", key: "companyName" },
    { name: "Email", key: "email" },
    { name: "Contact Person", key: "contact" },
    { name: "City", key: "city" },
    { name: "Action", key: "action" },
  ];

  // Build Job Table Row Data
  const renderJobRow = (row: any) => {
    return {
      date: row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "",
      company: row.company || "",
      jobTitle: row.jobTitle || "",
      city: Array.isArray(row.city) ? row.city.join(", ") : (row.city || ""),
      action: (
        <Stack direction="row" spacing={1} alignItems="center">
          <IconButton
            title="Restore"
            onClick={() => handleRestoreJob(row._id || row.id)}
            sx={{
              color: "#0096A4",
              "&:hover": {
                color: "#F1841D",
              },
            }}
          >
            <RestoreFromTrashIcon />
          </IconButton>
          <IconButton
            title="Delete Permanently"
            onClick={() => triggerHardDelete(row._id || row.id, "job")}
            sx={{
              color: "#d32f2f",
              "&:hover": {
                color: "#f44336",
              },
            }}
          >
            <DeleteForeverIcon />
          </IconButton>
        </Stack>
      ),
    };
  };

  // Build Company Table Row Data
  const renderCompanyRow = (row: any) => {
    return {
      companyName: row.companyName || "",
      email: row.email || "",
      contact: row.contactPerson || "",
      city: Array.isArray(row.city) ? row.city.join(", ") : (row.city || ""),
      action: (
        <Stack direction="row" spacing={1} alignItems="center">
          <IconButton
            title="Restore"
            onClick={() => handleRestoreCompany(row._id || row.id)}
            sx={{
              color: "#0096A4",
              "&:hover": {
                color: "#F1841D",
              },
            }}
          >
            <RestoreFromTrashIcon />
          </IconButton>
          <IconButton
            title="Delete Permanently"
            onClick={() => triggerHardDelete(row._id || row.id, "company")}
            sx={{
              color: "#d32f2f",
              "&:hover": {
                color: "#f44336",
              },
            }}
          >
            <DeleteForeverIcon />
          </IconButton>
        </Stack>
      ),
    };
  };

  return (
    <>
      <Title heading="Manage Trash" />

      {/* Premium Styled Tabs */}
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        sx={{
          mb: 3,
          borderBottom: "1px solid #e0e0e0",
          "& .MuiTabs-indicator": {
            backgroundColor: "#0096A4",
            height: "3px",
          },
          "& .MuiTab-root": {
            fontSize: "16px",
            fontWeight: "600",
            color: "#646464",
            textTransform: "none",
            minWidth: 160,
            "&.Mui-selected": {
              color: "#0096A4",
            },
          },
        }}
      >
        <Tab label="Deleted Jobs" />
        <Tab label="Deleted Companies" />
      </Tabs>

      {/* Content for Tab 0: Jobs */}
      {tabValue === 0 && (
        <>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            justifyContent="space-between"
            sx={{ mb: 2 }}
          >
            <Filter
              filter=""
              onFilterChange={() => {}}
              searchValue={jobsSearchValue}
              onSearchChange={setJobsSearchValue}
              filterOptions={[]}
            />
          </Stack>

          <Box sx={{ overflow: "hidden", position: "relative" }}>
            <CustomTable
              columns={JOB_COLUMNS}
              rows={jobsData.map(renderJobRow)}
              pageCount={jobsPageCount}
              setRecordPerPage={setJobsRecordPerPage}
              recordPerPage={jobsRecordPerPage}
              setPageNo={setJobsPageNo}
              pageNo={jobsPageNo}
              loading={jobsLoading}
            />
          </Box>
        </>
      )}

      {/* Content for Tab 1: Companies */}
      {tabValue === 1 && (
        <>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            justifyContent="space-between"
            sx={{ mb: 2 }}
          >
            <Filter
              filter=""
              onFilterChange={() => {}}
              searchValue={companiesSearchValue}
              onSearchChange={setCompaniesSearchValue}
              filterOptions={[]}
            />
          </Stack>

          <Box sx={{ overflow: "hidden", position: "relative" }}>
            <CustomTable
              columns={COMPANY_COLUMNS}
              rows={companiesData.map(renderCompanyRow)}
              pageCount={companiesPageCount}
              setRecordPerPage={setCompaniesRecordPerPage}
              recordPerPage={companiesRecordPerPage}
              setPageNo={setCompaniesPageNo}
              pageNo={companiesPageNo}
              loading={companiesLoading}
            />
          </Box>
        </>
      )}

      {/* Premium Confirmation Dialog */}
      <Dialog
        open={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        sx={{
          "& .MuiDialog-container": {
            "& .MuiPaper-root": {
              width: "100%",
              maxWidth: "450px",
              borderRadius: "12px",
              padding: "24px",
            },
          },
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <Stack direction="column" spacing={2} alignItems="center">
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: "50%",
                backgroundColor: "#fff0f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 1,
              }}
            >
              <WarningAmberIcon sx={{ fontSize: "40px", color: "#d32f2f" }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: "700", color: "#1a1a1a" }}>
              Delete Permanently?
            </Typography>
            <Typography variant="body1" sx={{ color: "#646464", fontSize: "14px", lineHeight: "1.5" }}>
              Warning: Are you sure you want to permanently delete this job/company? This action cannot be undone.
            </Typography>

            <Stack direction="row" spacing={2} sx={{ width: "100%", pt: 2 }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => setIsConfirmOpen(false)}
                disabled={deleteLoading}
                sx={{
                  borderRadius: "8px",
                  borderColor: "#e0e0e0",
                  color: "#646464",
                  textTransform: "none",
                  fontWeight: "600",
                  "&:hover": {
                    borderColor: "#b0b0b0",
                    backgroundColor: "#f5f5f5",
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                fullWidth
                variant="contained"
                onClick={onConfirmHardDelete}
                disabled={deleteLoading}
                sx={{
                  borderRadius: "8px",
                  backgroundColor: "#d32f2f",
                  color: "#fff",
                  textTransform: "none",
                  fontWeight: "600",
                  "&:hover": {
                    backgroundColor: "#b71c1c",
                  },
                }}
              >
                {deleteLoading ? "Deleting..." : "Delete"}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Dialog>

      <ToastContainer />
    </>
  );
};

export default ManageTrash;
