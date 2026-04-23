"use client";
import { SVG } from "@/app/components/icon";
import { Box, Button, IconButton, Stack } from "@mui/material";
import Title from "@/app/components/title.components";
import Filter from "@/app/components/filter";
import CustomTable from "@/app/components/table";
import { COLUMS_DATA as COLUM_DATA } from "./jobsData";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import DeleteModal from "@/app/components/delete.modal.components";
import { Job, UpdateJob, getAllJobsType } from "@/app/api/jobs/jobs.types";
import { deleteJOb, getAllJobs, updateJob } from "@/app/api/jobs/jobs";
import { useRouter } from "next/navigation";
import { useDebounce } from "@uidotdev/usehooks";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const ManageJobs = () => {
  const router = useRouter();
  const [rowData, setRowData] = useState<Job[]>([]);
  const [statusToggleId, setStatusToggleId] = useState<string>("");
  const [isDeleteModal, setDeleteModal] = useState(false);
  const [recordPerPage, setRecordPerPage] = useState<string>("5");
  const [pageCount, setPageCount] = useState<number>(0);
  const [searchValue, setSearchValue] = useState<string>("");
  const debouncedSearchTerm = useDebounce(searchValue, 300);
  const [pageNo, setPageNo] = useState<number>(1);
  const [filter, setFilter] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [deleteTableRowData, setDeleteTableRowData] = useState<Job>();
  const [mount, setMount] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const handleDeleteModal = () => {
    setDeleteModal(true);
  };
  const handleClose = () => {
    setDeleteModal(false);
  };
  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
  };
  const handleSearchChange = (newValue: string) => {
    setSearchValue(newValue);
  };
  const handleDelete = async (oldRowData: Job) => {
    setIsDeleteLoading(true);
    const rowIndex = rowData.findIndex((row) => row.id === oldRowData.id);
    if (rowIndex !== -1) {
      const updatedRows = [...rowData];
      updatedRows.splice(rowIndex, 1);
      const response = await deleteJOb(oldRowData.id || "");
      if (response.remote === "success") {
        setRowData(updatedRows);
        const notify = () => toast.info("Job delete successfully!");
        notify();
      } else {
        const notify = () => toast.info("Error deleting job!");
        notify();
        console.log("handleDelete", response);
        // Handle the oerrr response appropriately
      }
    }
    handleClose();
    setIsDeleteLoading(false);
  };
  const onConfirm = () => {
    if (deleteTableRowData) {
      handleDelete(deleteTableRowData);
    }
  };
  const handleStatusToggle = async (oldRowData: Job) => {
    if (oldRowData.id) {
      setStatusToggleId(oldRowData.id);
    }
    const rowIndex = rowData.findIndex((row) => row.id === oldRowData.id);
    if (rowIndex !== -1) {
      const updatedRows = [...rowData];
      updatedRows[rowIndex].status =
        updatedRows[rowIndex].status === "Active" ? "Inactive" : "Active";
      const payload: UpdateJob = {
        id: updatedRows[rowIndex].id || "",
        status: updatedRows[rowIndex].status === "Active" ? true : false,
      };
      const response = await updateJob(payload);
      if (response.remote === "success") {
        setRowData(updatedRows);
        const notify = () => toast.info("Status updated successfully!");
        notify();
      } else {
        const notify = () => toast.error("Error updating Status");
        notify();
      }
    }
    setStatusToggleId("");
  };
  const handleGetAllJobs = async () => {
    setLoading(true);
    const payload: getAllJobsType = {
      pageNo,
      searchValue,
      filter,
      recordPerPage,
    };
    const response = await getAllJobs(payload);
    if (response.remote === "success") {
      setRowData(response.data.data.data);
      setPageCount(response.data.data.count);
    }
    setLoading(false);
  };
  const handleDeleteTableRowData = (rowData: Job) => {
    setDeleteTableRowData(rowData);
  };
  const handleEdit = (id: string) => {
    router.push(`/manage-jobs/add/?id=${id}`);
  };
  const handleCopy = (id: string) => {
    router.push(`/manage-jobs/add/?id=${id}&action=copy`);
  };
  const handleShowJob = (id: string) => {
    router.push(`/manage-jobs/add/?id=${id}&action=show`);
  };
  // handle table row
  const handleTableRow = (rowData: any) => {
    const length = rowData.city[0].length - 1;
    return {
      id: rowData.id,
      date: rowData.date,
      company: rowData.company,
      jobTitle: rowData.jobTitle,
      startDate: rowData.startDate,
      industry: rowData.industryName,
      city: `${rowData.city[0][0]}` + `  ${length ? length + "more" : ""}`,
      applications: rowData.count,
      status: (
        <div
          style={{
            cursor: "pointer",
          }}
          onClick={() => {
            if (rowData.id !== statusToggleId) {
              handleStatusToggle(rowData);
            }
          }}
        >
          {rowData.id === statusToggleId ? "Processing..." : rowData.status}
        </div>
      ),
      action: (
        <Stack
          direction="row"
          spacing={1}
          alignItems={"center"}
          sx={{
            "& .MuiButtonBase-root": {
              color: "#0096A4",
              "&:hover": {
                color: "#F1841D",
              },
            },
          }}
        >
          <IconButton
            onClick={() => {
              handleShowJob(rowData.id);
            }}
          >
            <SVG.DashboardIcon />
          </IconButton>
          <IconButton
            onClick={() => {
              handleEdit(rowData.id);
            }}
          >
            <SVG.Edit />
          </IconButton>
          <IconButton
            onClick={() => {
              handleCopy(rowData.id);
            }}
          >
            <SVG.CopyIcon />
          </IconButton>
          <IconButton
            onClick={() => {
              handleDeleteModal();
              handleDeleteTableRowData(rowData);
            }}
          >
            <SVG.Delete />
          </IconButton>
        </Stack>
      ),
    };
  };

  useEffect(() => {
    handleGetAllJobs();
  }, [pageNo, filter, recordPerPage]);

  useEffect(() => {
    if (debouncedSearchTerm) {
      handleGetAllJobs();
    }
  }, [debouncedSearchTerm]);
  useEffect(() => {
    if (!searchValue && mount) {
      handleGetAllJobs();
    }
    setMount(true);
  }, [searchValue]);
  return (
    <>
      <Title heading="Manage Jobs" />
      {/* {loading && <CustomLoader />} */}
      <Stack
        direction={"row"}
        spacing={1}
        alignItems={"center"}
        justifyContent={"space-between"}
        sx={{ mb: 2 }}
      >
        <Filter
          filter={filter}
          onFilterChange={handleFilterChange}
          searchValue={searchValue}
          onSearchChange={handleSearchChange}
          filterOptions={[
            { name: "Create Date", value: "Date" },
            { name: "Start Date", value: "startDate" },
          ]}
        />

        <Button
          LinkComponent={Link}
          href="/manage-jobs/add"
          disableRipple={true}
          sx={{
            fontSize: "20px",
            color: "#646464",
            "&:hover": { color: "#0096A4" },
          }}
        >
          <SVG.AddIcon style={{ marginRight: "8px" }} /> Add
        </Button>
      </Stack>
      <Box sx={{ overflow: "hidden", position: "relative" }}>
        <CustomTable
          columns={COLUM_DATA}
          rows={rowData?.map((row) => handleTableRow(row)) || []}
          pageCount={pageCount}
          setRecordPerPage={setRecordPerPage}
          recordPerPage={recordPerPage}
          setPageNo={setPageNo}
          pageNo={pageNo}
          loading={loading}
        />
      </Box>
      <DeleteModal
        open={isDeleteModal}
        handleClose={handleClose}
        onConfirm={onConfirm}
        loading={isDeleteLoading}
      />
      <ToastContainer />
    </>
  );
};
export default ManageJobs;
