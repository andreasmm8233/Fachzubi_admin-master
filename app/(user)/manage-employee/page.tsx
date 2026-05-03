"use client";

import { SVG } from "@/app/components/icon";
import {
  Box,
  Button,
  Stack,
  IconButton,
} from "@mui/material";

import Title from "@/app/components/title.components";
import CustomTable from "@/app/components/table";
import { COLUMNS_DATA } from "./helper";
import { useEffect, useState } from "react";
import DeleteModal from "@/app/components/delete.modal.components";
import {
  getAllEmployees,
  updateEmployee,
  deleteEmployee,
} from "@/app/api/manageEmployee/employee";
import CustomLoader from "@/app/components/SpinLoader";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import InfoIcon from '@mui/icons-material/Info';

interface RowData {
  id: string;
  name: string;
  email: string;
  password?: string;
  status: string;
  permissions: string;
  createdAt: string;
}

const ManageEmployeePage = () => {
  const router = useRouter();
  const [isDeleteModal, setDeleteModal] = useState(false);
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [pageCount, setPageCount] = useState<number>(0);
  const [recordPerPage, setRecordPerPage] = useState<string>("10");
  const [pageNo, setPageNo] = useState<number>(1);
  const [loading, setIsLoading] = useState(true);
  const [deleteTableRowData, setDeleteTableRowData] = useState<RowData>();
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [statusToggleId, setStatusToggleId] = useState("");

  const handleDeleteModal = () => {
    setDeleteModal(true);
  };
  const handleClose = () => {
    setDeleteModal(false);
  };

  const handleGetAllEmployees = async () => {
    setIsLoading(true);
    const data = await getAllEmployees();
    if (data.remote === "success") {
      setRowData(data.data.data);
      setPageCount(data.data.data.length);
    }
    setIsLoading(false);
  };

  const handleStatusToggle = async (oldRowData: RowData) => {
    setStatusToggleId(oldRowData.id);
    const rowIndex = rowData.findIndex((row) => row.id === oldRowData.id);
    if (rowIndex !== -1) {
      const updatedRows = [...rowData];
      const payload = {
        id: updatedRows[rowIndex].id,
        isActive: updatedRows[rowIndex].status !== "Active",
      };
      const response = await updateEmployee(payload);
      if (response.remote === "success") {
        toast.info("Status updated successfully!");
        updatedRows[rowIndex].status =
          updatedRows[rowIndex].status === "Active" ? "Inactive" : "Active";
        setRowData(updatedRows);
      } else {
        toast.error("Error updating status!");
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
      const response = await deleteEmployee(oldRowData.id);
      if (response.remote === "success") {
        toast.info("Employee deleted successfully!");
        setRowData(updatedRows);
      } else {
        toast.error("Error deleting employee!");
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

  const navigateToEdit = (rowDataId: string) => {
    router.push(`/manage-employee/edit/${rowDataId}`);
  };

  const handleTableRow = (rowData: any) => {
    console.log("rowData", rowData);
    return {
      id: rowData.id,
      name: rowData.name,
      email: rowData.email,
      password: rowData.password || "N/A",
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
      permissions: (
        <div
          style={{
            fontSize: "13px",
            maxWidth: "300px",
            whiteSpace: "normal",
          }}
        >
          {rowData.permissions}
        </div>
      ),
      createdAt: rowData.createdAt,
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
            onClick={() => window.open(`/manage-employee/log/${rowData.id}`, '_blank')}
          >
            <InfoIcon />
          </IconButton>
          <IconButton
            onClick={() => {
              navigateToEdit(rowData.id);
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
    handleGetAllEmployees();
  }, []);

  return (
    <>
      <Title heading="Manage Employee" />
      <Stack
        direction={"row"}
        spacing={1}
        alignItems={"center"}
        justifyContent={"flex-end"}
        sx={{ mb: 2 }}
      >
        <Link href="/manage-employee/add">
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
          columns={COLUMNS_DATA}
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

export default ManageEmployeePage;
