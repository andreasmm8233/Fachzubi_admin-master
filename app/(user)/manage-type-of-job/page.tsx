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
import DeleteModal from "@/app/components/delete.modal.components";
import { useEffect, useState } from "react";
import IModal from "@/app/components/modal.components";
import AddEditJobTypes from "./addEdit.components";

import {
  TransformJobType,
  getAllJobTypesType,
} from "@/app/api/jobTypes/jobTypes.types";
import { useDebounce } from "@uidotdev/usehooks";
import CustomLoader from "@/app/components/SpinLoader";
import ErrorAlert from "@/themes/overrides/errorAlert";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  addJobType,
  deleteJobType,
  editJobType,
  getJobTypesByFilter,
} from "@/app/api/jobTypes/jobType";
import { COLUMS_DATA as COLUM_DATA } from "./jobData";

const ManageJobTypes = () => {
  const [isDeleteModal, setDeleteModal] = useState(false);
  const [isJobTypes, setIsJobTypes] = useState(false);
  const [pageCount, setPageCount] = useState<number>(0);
  const [recordPerPage, setRecordPerPage] = useState<string>("5");
  const [name, setName] = useState("");
  const [pageNo, setPageNo] = useState<number>(1);
  const [rowData, setRowData] = useState<TransformJobType[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const debouncedSearchTerm = useDebounce(searchValue, 300);
  const [mount, setMount] = useState(false);
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState<string>("");
  const [error, setError] = useState("");
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [saveModelLoading, setSaveModelLoading] = useState(false);

  const clearAllState = () => {
    setIsJobTypes(false);
    setDeleteModal(false);
    setId("");
    setName("");
  };

  const handleJobTypes = () => {
    setIsJobTypes(true);
  };

  const handleDeleteModal = () => {
    setDeleteModal(true);
  };

  const handleClose = async () => {
    if (id) {
      await handleEditJobTypes();
    } else {
      await handleAddJobTypes(name);
    }
    clearAllState();
  };

  const handleGetAll = async (isLoadingShow?: boolean) => {
    if (isLoadingShow) {
      setLoading(true);
    }

    const payload: getAllJobTypesType = {
      searchValue,
      pageNo,
      recordPerPage,
    };

    const response = await getJobTypesByFilter(payload);

    if (response.remote === "success") {
      setRowData(response.data.data.data);
      setPageCount(response.data.data.count);
    }

    setLoading(false);
  };

  const JobTypesTableRow = (rowData: any) => ({
    id: rowData.id,
    jobType: rowData.name,
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
            handleJobTypes();
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

  const handleAddJobTypes = async (name: string) => {
    setSaveModelLoading(true);

    const data = await addJobType(name);

    if (data.remote === "success") {
      await handleGetAll();
      const notify = () => toast.info("Add job type successfully!");
      notify();
    } else {
      const notify = () => toast.error("Error Adding Job Type");
      notify();
    }

    setSaveModelLoading(false);
  };

  const handleEditJobTypes = async () => {
    setSaveModelLoading(true);

    const payload = {
      name,
      id,
    };

    const data = await editJobType(payload);

    if (data.remote === "success") {
      await handleGetAll();
      const notify = () => toast.info("Job type updated successfully!");
      notify();
    } else {
      const notify = () => toast.error("Error Job Type");
      notify();
    }

    setSaveModelLoading(false);
  };

  const handleDeleteJobTypes = async (id: string) => {
    setIsDeleteLoading(true);

    const data = await deleteJobType(id);

    if (data.remote === "success") {
      await handleGetAll();
      const notify = () => toast.info("Delete job type successfully!");
      notify();
    } else {
      const notify = () => toast.error("Error deleting job type");
      notify();
    }

    setIsDeleteLoading(false);
  };

  const onConfirm = async () => {
    await handleDeleteJobTypes(id);
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
      <Title heading="Manage Job Types" />
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
          onClick={() => handleJobTypes()}
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
          columns={COLUM_DATA} // Assuming you have COLUMS_DATA defined somewhere
          rows={rowData?.map((row) => JobTypesTableRow(row)) || []}
          pageCount={pageCount}
          setRecordPerPage={setRecordPerPage}
          recordPerPage={recordPerPage}
          setPageNo={setPageNo}
          pageNo={pageNo}
          loading={loading}
        />
      </Box>
      <IModal
        open={isJobTypes}
        handleClose={() => setIsJobTypes(false)}
        maxWidth="450px"
      >
        <AddEditJobTypes
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

export default ManageJobTypes;
