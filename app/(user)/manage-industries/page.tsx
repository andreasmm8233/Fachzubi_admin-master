"use client";

import { SVG } from "@/app/components/icon";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
} from "@mui/material";

import Title from "@/app/components/title.components";
import CustomTable from "@/app/components/table";
import { COLUMS_DATA, ROW_DATA } from "./IndustriesData";
import DeleteModal from "@/app/components/delete.modal.components";
import { useEffect, useState } from "react";
import IModal from "@/app/components/modal.components";
import AddEditIndustries from "./addEdit.components";
import {
  EditIndustry,
  addIndustry,
  deleteIndustry,
  getIndustries,
  getIndustriesByFilter,
} from "@/app/api/industries/industries";
import {
  TransformIndustry,
  getAllIndustriesType,
} from "@/app/api/industries/industries.types";
import { useDebounce } from "@uidotdev/usehooks";
import CustomLoader from "@/app/components/SpinLoader";
import ErrorAlert from "@/themes/overrides/errorAlert";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const ManageIndustries = () => {
  const [isDeleteModal, setDeleteModal] = useState(false);
  const [isIndustries, setIsIndustries] = useState(false);
  const [pageCount, setPageCount] = useState<number>(0);
  const [recordPerPage, setRecordPerPage] = useState<string>("5");
  const [name, setName] = useState("");
  const [pageNo, setPageNo] = useState<number>(1);
  const [rowData, setRowData] = useState<TransformIndustry[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const debouncedSearchTerm = useDebounce(searchValue, 300);
  const [mount, setMount] = useState(false);
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState<string>("");
  const [error, setError] = useState("");
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [saveModelLoading, setSaveModelLoading] = useState(false);
  const clearAllState = () => {
    setIsIndustries(false);
    setDeleteModal(false);
    setId("");
    setName("");
  };
  const handleIndustries = () => {
    setIsIndustries(true);
  };
  const handleDeleteModal = () => {
    setDeleteModal(true);
  };

  const handleClose = async () => {
    if (id) {
      await handleEditIndustries();
    } else {
      await handleAddIndustries(name);
    }
    clearAllState();
  };
  const handleGetAll = async (isLoadingShow?: boolean) => {
    if (isLoadingShow) {
      setLoading(true);
    }
    const payload: getAllIndustriesType = {
      searchValue,
      pageNo,
      recordPerPage,
    };
    const response = await getIndustriesByFilter(payload);
    if (response.remote === "success") {
      setRowData(response.data.data.data);
      setPageCount(response.data.data.count);
    }
    setLoading(false);
  };
  const IndustriesTableRow = (rowData: any) => ({
    id: rowData.id,
    industry: rowData.name,
    action: (
      <Stack
        direction="row"
        spacing={2}
        alignItems={"center"}
        sx={{
          "& .MuiButtonBase-root": {
            color: "#0096A4",
            px: 0,
            "&:hover": {
              color: "#F1841D",
            },
          },
        }}
      >
        <IconButton
          disableRipple={true}
          onClick={() => {
            handleIndustries();
            setId(rowData.id);
            setName(rowData.name);
          }}
        >
          <SVG.Edit />
        </IconButton>

        <IconButton
          onClick={() => {
            handleDeleteModal();
            setId(rowData.id);
          }}
          disableRipple={true}
        >
          <SVG.Delete />
        </IconButton>
      </Stack>
    ),
  });
  const handleAddIndustries = async (name: string) => {
    setSaveModelLoading(true);
    const data = await addIndustry(name);
    if (data.remote === "success") {
      await handleGetAll();
      const notify = () => toast.info("Add industry  successfully!");
      notify();
    } else {
      const notify = () => toast.error("Error Adding Industries City");
      notify();
    }
    setSaveModelLoading(false);
  };
  const handleEditIndustries = async () => {
    setSaveModelLoading(true);
    const payload = {
      name,
      id,
    };
    const data = await EditIndustry(payload);
    if (data.remote === "success") {
      await handleGetAll();
      const notify = () => toast.info("Industry updated successfully!");
      notify();
    } else {
      const notify = () => toast.error("Error Industries City");
      notify();
    }
    setSaveModelLoading(false);
  };
  const handleDeleteIndustries = async (id: string) => {
    setIsDeleteLoading(true);
    const data = await deleteIndustry(id);
    if (data.remote === "success") {
      await handleGetAll();
      const notify = () => toast.info("Delete industries successfully!");
      notify();
    } else {
      const notify = () => toast.error("Error deleting industries");
      notify();
    }
    setIsDeleteLoading(false);
  };

  const onConfirm = async () => {
    await handleDeleteIndustries(id);
    clearAllState();
  };
  useEffect(() => {
    handleGetAll(true);
  }, [pageNo, recordPerPage]);
  useEffect(() => {
    if (debouncedSearchTerm) {
      handleGetAll(true);
    }
  }, [debouncedSearchTerm]);
  useEffect(() => {
    if (!searchValue && mount) {
      handleGetAll(true);
    }
    setMount(true);
  }, [searchValue]);
  useEffect(() => {
    if (error) {
      const timeoutId = setTimeout(() => {
        setError("");
      }, 5000); // 5000 milliseconds = 5 seconds

      // Clear the timeout if the component unmounts before the 5 seconds
      return () => clearTimeout(timeoutId);
    }
  }, [error]);
  return (
    <>
      <Title heading="Manage Industries" />
      {error && <ErrorAlert severity="error" message={error} />}
      <Stack
        direction={"row"}
        spacing={1}
        alignItems={"center"}
        justifyContent={"space-between"}
        sx={{ mb: 2 }}
      >
        <TextField
          onChange={(e) => {
            setSearchValue(e.target.value);
          }}
          sx={{
            "& .MuiInputBase-root": {
              color: "rgba(0, 0, 0, 0.60)",
              background: "transparent !important",
              borderRadius: "0px",
              border: "0px",
              padding: "0px",
              "& .MuiInputBase-input": {
                padding: "0px",
              },
            },
            "& input::placeholder": {
              color: "rgba(0, 0, 0, 0.60)",
              opacity: 1,
            },
          }}
          placeholder="Search"
          id="input-with-icon-textfield"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SVG.Search />
              </InputAdornment>
            ),
          }}
          variant="outlined"
        />
        <Button
          onClick={() => handleIndustries()}
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
          columns={COLUMS_DATA}
          rows={rowData?.map((row) => IndustriesTableRow(row)) || []}
          pageCount={pageCount}
          setRecordPerPage={setRecordPerPage}
          recordPerPage={recordPerPage}
          setPageNo={setPageNo}
          pageNo={pageNo}
          loading={loading}
        />
      </Box>
      <IModal open={isIndustries} handleClose={()=>setIsIndustries(false)} maxWidth="450px">
        <AddEditIndustries
          handleClose={handleClose}
          name={name}
          setName={setName}
          clearAllState={clearAllState}
          loading={saveModelLoading}
        />
      </IModal>
      <DeleteModal
        open={isDeleteModal}
        handleClose={clearAllState}
        onConfirm={onConfirm}
        loading={isDeleteLoading}
      />
      <ToastContainer />
    </>
  );
};
export default ManageIndustries;
