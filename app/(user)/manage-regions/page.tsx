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
import { COLUMS_DATA } from "./regionsData";
import DeleteModal from "@/app/components/delete.modal.components";
import { useEffect, useState } from "react";
import IModal from "@/app/components/modal.components";
import AddEditRegions from "./addEdit.components";
import {
  addRegion,
  editRegion,
  deleteRegion,
  getRegionsByFilter,
} from "@/app/api/regions/regions";
import {
  TransformRegion,
  getAllRegionsType,
} from "@/app/api/regions/regions.types";
import { useDebounce } from "@uidotdev/usehooks";
import CustomLoader from "@/app/components/SpinLoader";
import ErrorAlert from "@/themes/overrides/errorAlert";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ManageRegions = () => {
  const [isDeleteModal, setDeleteModal] = useState(false);
  const [isRegions, setIsRegions] = useState(false);
  const [pageCount, setPageCount] = useState<number>(0);
  const [recordPerPage, setRecordPerPage] = useState<string>("5");
  const [name, setName] = useState("");
  const [pageNo, setPageNo] = useState<number>(1);
  const [rowData, setRowData] = useState<TransformRegion[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const debouncedSearchTerm = useDebounce(searchValue, 300);
  const [mount, setMount] = useState(false);
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState<string>("");
  const [error, setError] = useState("");
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [saveModelLoading, setSaveModelLoading] = useState(false);

  const clearAllState = () => {
    setIsRegions(false);
    setDeleteModal(false);
    setId("");
    setName("");
  };

  const handleRegions = () => {
    setIsRegions(true);
  };

  const handleDeleteModal = () => {
    setDeleteModal(true);
  };

  const handleClose = async () => {
    if (id) {
      await handleEditRegions();
    } else {
      await handleAddRegions(name);
    }
    clearAllState();
  };

  const handleGetAll = async (isLoadingShow?: boolean) => {
    if (isLoadingShow) {
      setLoading(true);
    }
    const payload: getAllRegionsType = {
      searchValue,
      pageNo,
      recordPerPage,
    };
    const response = await getRegionsByFilter(payload);
    if (response.remote === "success") {
      setRowData(response.data.data.data);
      setPageCount(response.data.data.count);
    }
    setLoading(false);
  };

  const RegionsTableRow = (row: any) => ({
    id: row.id,
    region: row.name,
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
            handleRegions();
            setId(row.id);
            setName(row.name);
          }}
        >
          <SVG.Edit />
        </IconButton>

        <IconButton
          onClick={() => {
            handleDeleteModal();
            setId(row.id);
          }}
          disableRipple={true}
        >
          <SVG.Delete />
        </IconButton>
      </Stack>
    ),
  });

  const handleAddRegions = async (name: string) => {
    setSaveModelLoading(true);
    const data = await addRegion(name);
    if (data.remote === "success") {
      await handleGetAll();
      toast.info("Add region successfully!");
    } else {
      toast.error("Error adding region");
    }
    setSaveModelLoading(false);
  };

  const handleEditRegions = async () => {
    setSaveModelLoading(true);
    const payload = {
      name,
      id,
    };
    const data = await editRegion(payload);
    if (data.remote === "success") {
      await handleGetAll();
      toast.info("Region updated successfully!");
    } else {
      toast.error("Error updating region");
    }
    setSaveModelLoading(false);
  };

  const handleDeleteRegions = async (id: string) => {
    setIsDeleteLoading(true);
    const data = await deleteRegion(id);
    if (data.remote === "success") {
      await handleGetAll();
      toast.info("Delete region successfully!");
    } else {
      toast.error("Error deleting region");
    }
    setIsDeleteLoading(false);
  };

  const onConfirm = async () => {
    await handleDeleteRegions(id);
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
      }, 5000);
      return () => clearTimeout(timeoutId);
    }
  }, [error]);

  return (
    <>
      <Title heading="Manage Regions" />
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
          onClick={() => handleRegions()}
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
          rows={rowData?.map((row) => RegionsTableRow(row)) || []}
          pageCount={pageCount}
          setRecordPerPage={setRecordPerPage}
          recordPerPage={recordPerPage}
          setPageNo={setPageNo}
          pageNo={pageNo}
          loading={loading}
        />
      </Box>
      <IModal open={isRegions} handleClose={() => setIsRegions(false)} maxWidth="450px">
        <AddEditRegions
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

export default ManageRegions;
