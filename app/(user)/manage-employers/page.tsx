"use client";

import { SVG } from "@/app/components/icon";
import {
  Box,
  Button,
  LinearProgress,
  Paper,
  Stack,
  TableContainer,
  IconButton,
  // Link
} from "@mui/material";

import Title from "@/app/components/title.components";
import Filter from "@/app/components/filter";
import CustomTable from "@/app/components/table";
import { COLUMS_DATA as COLUM_DATA } from "./helper";
import { useEffect, useState } from "react";
import DeleteModal from "@/app/components/delete.modal.components";
import {
  deleteEmployer,
  editEmployer,
  getAllEmployers,
} from "@/app/api/employer/employer";
import {
  PartialUpdateEmployerType,
  getAllEmployerType,
} from "@/app/api/employer/helper";
import CustomLoader from "@/app/components/SpinLoader";
import { useRouter } from "next/navigation";
import { useDebounce } from "@uidotdev/usehooks";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
interface RowData {
  id: string;
  date: string;
  companyName: string;
  email: string;
  contact: string;
  industry: string;
  city: string;
  status: string;
}
const ManageEmployee = () => {
  const router = useRouter();
  const [filter, setFilter] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");
  const debouncedSearchTerm = useDebounce(searchValue, 300);
  const [isDeleteModal, setDeleteModal] = useState(false);
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [pageCount, setPageCount] = useState<number>(0);
  const [recordPerPage, setRecordPerPage] = useState<string>("5");
  const [pageNo, setPageNo] = useState<number>(1);
  const [loading, setIsLoading] = useState(true);
  const [deleteTableRowData, setDeleteTableRowData] = useState<RowData>();
  const [mount, setMount] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [statusToggleId, setStatusToggleId] = useState("");
  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
  };

  const handleSearchChange = (newValue: string) => {
    setSearchValue(newValue);
  };

  const handleDeleteModal = () => {
    setDeleteModal(true);
  };
  const handleClose = () => {
    setDeleteModal(false);
  };
  const handleGetAllEmployer = async () => {
    setIsLoading(true);
    const payload: getAllEmployerType = {
      pageNo,
      searchValue,
      filter,
      recordPerPage,
    };
    const data = await getAllEmployers(payload);
    if (data.remote === "success") {
      setRowData(data.data.data.data);
      setPageCount(data.data.data.count);
    }
    setIsLoading(false);
  };
  const handleStatusToggle = async (oldRowData: RowData) => {
    console.log({ oldRowData });
    setStatusToggleId(oldRowData.id);
    const rowIndex = rowData.findIndex((row) => row.id === oldRowData.id);
    if (rowIndex !== -1) {
      const updatedRows = [...rowData];
      const payload: PartialUpdateEmployerType = {
        id: updatedRows[rowIndex].id,
        status: updatedRows[rowIndex].status === "Active" ? false : true,
      };
      const response = await editEmployer(payload);
      if (response.remote === "success") {
        const notify = () => toast.info("Status updated successfully!");
        notify();
        updatedRows[rowIndex].status =
          updatedRows[rowIndex].status === "Active" ? "Inactive" : "Active";
        setRowData(updatedRows);
      } else {
        const notify = () => toast.error("Error updating successfully!");
        notify();
        console.log("handleStatusToggle", response);
      }
    }
    setStatusToggleId("");
  };
  const handleDelete = async (oldRowData: RowData) => {
    setIsDeleteLoading(true);
    const rowIndex = rowData.findIndex((row) => row.id === oldRowData.id);
    if (rowIndex !== -1) {
      const updatedRows = [...rowData];
      updatedRows.splice(rowIndex, 1);
      const response = await deleteEmployer(oldRowData.id);
      if (response.remote === "success") {
        const notify = () => toast.info("Employer delete successfully!");
        notify();
        setRowData(updatedRows);
      } else {
        const notify = () => toast.info("Error deleting employer!");
        notify();
        console.log("handleDelete", response);
        // Handle the oerrr response appropriately
      }
    }
    handleClose();
    setIsDeleteLoading(false);
  };
  const handleDeleteTableRowData = (rowData: RowData) => {
    setDeleteTableRowData(rowData);
  };
  const onConfirm = () => {
    if (deleteTableRowData) {
      handleDelete(deleteTableRowData);
    }
  };

  const navigateToAdd = (rowDataId: string) => {
    router.push(`/manage-employers/add?id=${rowDataId}`);
  };
  const navigateToCopy = (rowDataId: string, action: boolean) => {
    router.push(`/manage-employers/add?id=${rowDataId}&new=${action}`);
  };
  // handle table row
  const handleTableRow = (rowData: any) => {
    return {
      id: rowData.id,
      companyName: rowData.companyName,
      email: rowData.email,
      contact: rowData.contact,
      industry: rowData.industry || "",
      city: rowData.city || "",
      status: (
        <div
          style={{
            cursor: "pointer",
            color: "#0096A4",
          }}
          onClick={() => {
            if (rowData.id !== statusToggleId) {
              handleStatusToggle(rowData);
            }
          }}
        >
          {statusToggleId === rowData.id ? "Processing..." : rowData.status}
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
              navigateToCopy(rowData.id, true);
            }}
          >
            <SVG.DashboardIcon />
          </IconButton>
          <IconButton
            onClick={() => {
              navigateToAdd(rowData.id);
            }}
          >
            <SVG.Edit />
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
    handleGetAllEmployer();
  }, [pageNo, filter, recordPerPage]);
  useEffect(() => {
    if (debouncedSearchTerm) {
      handleGetAllEmployer();
    }
  }, [debouncedSearchTerm]);
  useEffect(() => {
    if (!searchValue && mount) {
      handleGetAllEmployer();
    }
    setMount(true);
  }, [searchValue]);
  return (
    <>
      <Title heading="Manage Employers" />
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
            { name: "Company Name", value: "companyName" },
          ]}
        />
        <Link href="/manage-employers/add?action=false">
          <Button
            disableRipple={true}
            sx={{
              fontSize: "20px",
              color: "#646464",
              "&:hover": { color: "#0096A4" },
            }}
          >
            <SVG.AddIcon style={{ marginRight: "8px" }} /> Add
          </Button>
        </Link>
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
export default ManageEmployee;
