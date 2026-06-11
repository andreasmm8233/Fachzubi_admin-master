"use client";

import { SVG } from "@/app/components/icon";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";

import Title from "@/app/components/title.components";
import CustomTable from "@/app/components/table";
import { COLUMS_DATA } from "./cityData";
import DeleteModal from "@/app/components/delete.modal.components";
import { useEffect, useState } from "react";
import IModal from "@/app/components/modal.components";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import AddCities from "./add-cities";
import { useDebounce } from "@uidotdev/usehooks";
import {
  City,
  TransformCity,
  getAllCitiesType,
} from "@/app/api/city/city.types";
import {
  addCity,
  deleteCity,
  downloadCityQr,
  editCity,
  editCityStatus,
  getCitiesByFilter,
} from "@/app/api/city/city";
import CustomLoader from "@/app/components/SpinLoader";
import ErrorAlert from "@/themes/overrides/errorAlert";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import FileCopyIcon from "@mui/icons-material/FileCopy";

const ManageCities = () => {
  const role = useSelector((state: RootState) => state.auth.role);
  const [isDeleteModal, setDeleteModal] = useState(false);
  const [isAddCity, setIsAddCity] = useState(false);
  const [pageCount, setPageCount] = useState<number>(0);
  const [recordPerPage, setRecordPerPage] = useState<string>("10");
  const [pageNo, setPageNo] = useState<number>(1);
  const [isInitialized, setIsInitialized] = useState(false);
  const [name, setName] = useState("");
  const [rowData, setRowData] = useState<TransformCity[]>([]);
  const [id, setId] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");
  const debouncedSearchTerm = useDebounce(searchValue, 300);
  const [mount, setMount] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [isUpdateLoading, setIsUpdateLoading] = useState("");
  const [qrDownloadLoadingId, setQrDownloadLoadingId] = useState("");
  const [saveModelLoading, setSaveModelLoading] = useState(false);
  const [dataForEdit, setDataForEdit] = useState<City>();
  const [duplicateFromCityId, setDuplicateFromCityId] = useState<string>("");
  const clearAllState = () => {
    setIsAddCity(false);
    setDeleteModal(false);
    setId("");
    setName("");
    setDuplicateFromCityId("");
    setDataForEdit(undefined);
    setSaveModelLoading(false);
  };
  const handleAddCityModel = () => {
    setIsAddCity(true);
  };

  const handleDeleteModal = () => {
    setDeleteModal(true);
  };

  const handleClose = async (data: City) => {
    setSaveModelLoading(true);
    if (id) {
      await handleEditCity(data);
    } else {
      const payload = duplicateFromCityId
        ? { ...data, duplicateFromCityId }
        : data;
      await handleAddCity(payload);
    }
    clearAllState();
  };

  const handleGetAll = async (isLoadingShow?: boolean) => {
    if (!isInitialized) return;
    if (isLoadingShow) {
      setLoading(true);
    }
    const payload: getAllCitiesType = {
      searchValue,
      pageNo,
      recordPerPage,
    };
    const response = await getCitiesByFilter(payload);
    if (response.remote === "success") {
      setRowData(response.data.data.data);
      setPageCount(response.data.data.count);
    }
    setLoading(false);
  };
  const handleEditButton = (rowData: TransformCity) => {
    handleAddCityModel();
    setId(rowData.id);
    setName(rowData.name);
    setDataForEdit({ ...rowData, _id: "" });
  };

  const handleDuplicateButton = (rowData: TransformCity) => {
    handleAddCityModel();
    setId("");
    setDuplicateFromCityId(rowData.id);
    const newName = rowData.name + " (Copy)";
    setName(newName);

    // Prefill QR Target URL with a unique valid name to avoid Formik validation failure
    const formattedName = rowData.name.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
    const suffix = Math.floor(10000000 + Math.random() * 90000000);
    const duplicateQrTargetUrl = `https://fachzubi-app.de/jobs/${formattedName}-copy-${suffix}`;

    setDataForEdit({
      ...rowData,
      _id: "",
      qrTargetUrl: duplicateQrTargetUrl,
    });
  };

  const handleStatusToggle = async (currentRawId: string) => {
    if (!isUpdateLoading) {
      const dummyData = [];
      setIsUpdateLoading(currentRawId);
      for (const city of rowData) {
        const updatedCity = { ...city };
        if (city.id === currentRawId) {
          updatedCity.status = !city.status;
          await editCityStatus({
            id: city.id,
            status: updatedCity.status,
          });
        }
        dummyData.push(updatedCity);
      }
      setIsUpdateLoading("");
      setRowData(dummyData);
      toast.info("status update successfully");
    }
  };

  const handleDownloadQr = async (city: TransformCity) => {
    if (!city.id || qrDownloadLoadingId) {
      return;
    }

    setQrDownloadLoadingId(city.id);
    const response = await downloadCityQr(city.id);
    if (response.remote === "success") {
      const qrBlob =
        response.data.data instanceof Blob
          ? response.data.data
          : new Blob([response.data.data]);
      const url = window.URL.createObjectURL(qrBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${city.name || "city"}-qr.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.info("QR downloaded successfully!");
    } else {
      toast.error(response.error.errors.message || "Error downloading QR");
    }
    setQrDownloadLoadingId("");
  };

  const CityTableRow = (SingleRowData: TransformCity) => {
    return {
      id: SingleRowData.id,
      industry: SingleRowData.name,
      startTime:
        SingleRowData.startTime === "Invalid Date"
          ? ""
          : SingleRowData.startTime,
      endTime:
        SingleRowData.endTime === "Invalid Date" ? "" : SingleRowData.endTime,
      address: SingleRowData.address,
      zipCode: SingleRowData.zipCode,
      directionLink: (
        <Tooltip title={SingleRowData.directionLink}>
          <Link href={SingleRowData.directionLink} target="blank">
            {SingleRowData.directionLink.length > 15
              ? SingleRowData.directionLink.slice(0, 15) + "..."
              : SingleRowData.directionLink}
          </Link>
        </Tooltip>
      ),
      qrCode: SingleRowData.qrCode ? (
        <Tooltip title={SingleRowData.qrTargetUrl || ""}>
          <Link
            href={SingleRowData.qrTargetUrl || SingleRowData.qrCode}
            target="blank"
          >
            <Box
              component="img"
              src={SingleRowData.qrCode}
              alt={`${SingleRowData.name} QR code`}
              sx={{
                width: "52px",
                height: "52px",
                display: "block",
                objectFit: "contain",
              }}
            />
          </Link>
        </Tooltip>
      ) : (
        ""
      ),
      status: (
        <div
          style={{
            cursor: "pointer",
            color: "#0096A4",
          }}
          onClick={async () => {
            await handleStatusToggle(SingleRowData.id);
          }}
        >
          {SingleRowData.id === isUpdateLoading
            ? "Processing..."
            : SingleRowData.status
              ? "active"
              : "inactive"}
        </div>
      ),
      createdBy: SingleRowData.createdBy
        ? SingleRowData.createdBy.first_name
          ? `${SingleRowData.createdBy.first_name || ""} ${SingleRowData.createdBy.last_name || ""
            }`.trim()
          : SingleRowData.createdBy.username || "N/A"
        : "N/A",
      duplicate: (
        <Button
          onClick={() => {
            handleDuplicateButton(SingleRowData);
          }}
          disableRipple={true}
          startIcon={<FileCopyIcon sx={{ fontSize: "18px !important" }} />}
          sx={{
            fontSize: "14px",
            fontWeight: "600",
            color: "#0096A4",
            textTransform: "none",
            padding: 0,
            minWidth: 0,
            "&:hover": {
              color: "#F1841D",
              backgroundColor: "transparent",
            },
          }}
        >
          Duplicate
        </Button>
      ),
      action: (
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
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
            title="Edit"
            disableRipple={true}
            onClick={() => {
              handleEditButton(SingleRowData);
            }}
          >
            <SVG.Edit />
          </IconButton>

          <IconButton
            title="Download QR"
            onClick={() => {
              handleDownloadQr(SingleRowData);
            }}
            disableRipple={true}
            disabled={
              !SingleRowData.qrCode || qrDownloadLoadingId === SingleRowData.id
            }
          >
            <FileDownloadIcon />
          </IconButton>

          <IconButton
            onClick={() => {
              handleDeleteModal();
              setId(SingleRowData.id);
            }}
            disableRipple={true}
          >
            <SVG.Delete />
          </IconButton>
        </Stack>
      ),
    };
  };

  const handleAddCity = async (payload: City) => {
    setSaveModelLoading(true);
    const data = await addCity(payload);
    if (data.remote === "success") {
      await handleGetAll();
      const notify = () => toast.info("City added successfully!");
      notify();
    } else {
      const notify = () => toast.error("Error adding City");
      notify();
    }
    setSaveModelLoading(false);
  };

  const handleEditCity = async (payloadForEdit: City) => {
    const payload = {
      id,
      ...payloadForEdit,
    };
    const data = await editCity(payload);
    if (data.remote === "success") {
      await handleGetAll();
      const notify = () => toast.info("City updated successfully!");
      notify();
    } else {
      const notify = () => toast.error("Error updating City");
      notify();
    }
  };

  const handleDeleteCity = async (id: string) => {
    setIsDeleteLoading(true);
    const data = await deleteCity(id);
    if (data.remote === "success") {
      await handleGetAll();
      const notify = () => toast.info("City deleted successfully!");
      notify();
    } else {
      const notify = () => toast.error("Error deleting city");
      notify();
    }
    setIsDeleteLoading(false);
  };

  const onConfirm = async () => {
    await handleDeleteCity(id);
    clearAllState();
  };

  useEffect(() => {
    handleGetAll(true);
  }, [pageNo, recordPerPage, isInitialized]);

  useEffect(() => {
    const saved = sessionStorage.getItem("manage-cities-page");
    if (saved) {
      setPageNo(Number(saved));
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      sessionStorage.setItem("manage-cities-page", String(pageNo));
    }
  }, [pageNo, isInitialized]);

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
      <Title heading="Manage Cities" />
      {/* {loading && <CustomLoader />} */}
      {error && <ErrorAlert severity="error" message={error} />}
      <Stack
        direction={"row"}
        spacing={1}
        alignItems={"center"}
        justifyContent={"space-between"}
        sx={{ mb: 2 }}
      >
        <TextField
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
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value);
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
          onClick={() => handleAddCityModel()}
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
          columns={COLUMS_DATA.filter((col) => role === "employee" ? col.key !== "qrCode" : true)}
          rows={rowData?.map((row) => CityTableRow(row)) || []}
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
        handleClose={clearAllState}
        onConfirm={onConfirm}
        loading={isDeleteLoading}
      />
      <IModal open={isAddCity} handleClose={clearAllState}>
        <AddCities role={role}
          handleClose={handleClose}
          name={name}
          setName={setName}
          clearAllState={clearAllState}
          loading={saveModelLoading}
          startTime={dataForEdit?.startTime}
          endTime={dataForEdit?.endTime}
          zipCode={dataForEdit?.zipCode}
          address={dataForEdit?.address}
          directionLink={dataForEdit?.directionLink}
          qrTargetUrl={dataForEdit?.qrTargetUrl}
        />
      </IModal>
      <ToastContainer />
    </>
  );
};
export default ManageCities;
