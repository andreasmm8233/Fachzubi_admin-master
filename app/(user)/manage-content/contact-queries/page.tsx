"use client";

import { SVG } from "@/app/components/icon";
import {
  Box,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import CloseIcon from "@mui/icons-material/Close";
import IModal from "@/app/components/modal.components";
import Title from "@/app/components/title.components";
import CustomTable from "@/app/components/table";
import DeleteModal from "@/app/components/delete.modal.components";
import { useEffect, useState } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import {
  ContactQuery,
  deleteContactQuery,
  getContactQueries,
} from "@/app/api/contact/contact";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const COLUMNS = [
  { id: 1, name: "Date", key: "date", width: "18%" },
  { id: 2, name: "Company", key: "companyName", width: "26%" },
  { id: 3, name: "E-Mail", key: "email", width: "26%" },
  { id: 4, name: "Phone", key: "phoneNo", width: "18%" },
  { id: 5, name: "Action", key: "action", width: "12%" },
];

// Messages sent through the contact form on the website
const formatDate = (value: string) =>
  new Date(value).toLocaleString("de-DE", { dateStyle: "short", timeStyle: "short" });

const actionSx = { color: "#0096A4", px: 0, "&:hover": { color: "#F1841D" } };

const ContactQueries = () => {
  const [rows, setRows] = useState<ContactQuery[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const [recordPerPage, setRecordPerPage] = useState("10");
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearch = useDebounce(searchValue, 300);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState("");
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [viewQuery, setViewQuery] = useState<ContactQuery | null>(null);

  const handleGetAll = async () => {
    setLoading(true);
    const response = await getContactQueries({
      searchValue: debouncedSearch,
      pageNo,
      recordPerPage,
    });
    if (response.remote === "success") {
      setRows(response.data.data.queries);
      setPageCount(response.data.data.count);
    }
    setLoading(false);
  };

  useEffect(() => {
    handleGetAll();
  }, [pageNo, recordPerPage, debouncedSearch]);

  const onConfirmDelete = async () => {
    setIsDeleteLoading(true);
    const response = await deleteContactQuery(deleteId);
    if (response.remote === "success") {
      toast.info("Query deleted successfully!");
      await handleGetAll();
    } else {
      toast.error("Error deleting query");
    }
    setIsDeleteLoading(false);
    setDeleteId("");
  };

  const toRow = (query: ContactQuery) => ({
    id: query._id,
    date: formatDate(query.createdAt),
    companyName: query.companyName,
    email: <a href={`mailto:${query.email}`}>{query.email}</a>,
    phoneNo: <a href={`tel:${query.phoneNo}`}>{query.phoneNo}</a>,
    action: (
      <Stack direction="row" spacing={2} alignItems="center">
        <IconButton
          disableRipple={true}
          aria-label="View query"
          onClick={() => setViewQuery(query)}
          sx={actionSx}
        >
          <VisibilityOutlinedIcon />
        </IconButton>
        <IconButton
          disableRipple={true}
          aria-label="Delete query"
          onClick={() => setDeleteId(query._id)}
          sx={actionSx}
        >
          <SVG.Delete />
        </IconButton>
      </Stack>
    ),
  });

  return (
    <>
      <Title heading="Contact Queries" />
      <Stack direction={"row"} alignItems={"center"} sx={{ mb: 2 }}>
        <TextField
          onChange={(e) => {
            setSearchValue(e.target.value);
            setPageNo(1);
          }}
          sx={{
            "& .MuiInputBase-root": {
              color: "rgba(0, 0, 0, 0.60)",
              background: "transparent !important",
              borderRadius: "0px",
              border: "0px",
              padding: "0px",
              "& .MuiInputBase-input": { padding: "0px" },
            },
          }}
          placeholder="Search company, e-mail or phone"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SVG.Search />
              </InputAdornment>
            ),
          }}
          variant="outlined"
        />
      </Stack>
      <Box sx={{ overflow: "hidden", position: "relative" }}>
        <CustomTable
          columns={COLUMNS}
          rows={rows.map(toRow)}
          pageCount={pageCount}
          setRecordPerPage={setRecordPerPage}
          recordPerPage={recordPerPage}
          setPageNo={setPageNo}
          pageNo={pageNo}
          loading={loading}
        />
      </Box>
      <IModal open={Boolean(viewQuery)} handleClose={() => setViewQuery(null)} maxWidth="600px">
        {viewQuery && (
          <>
            <DialogTitle sx={{ fontWeight: 700, pr: 6 }}>
              Contact Query
              <IconButton
                aria-label="Close"
                onClick={() => setViewQuery(null)}
                sx={{ position: "absolute", right: 12, top: 12 }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers>
              {[
                { label: "Date", value: formatDate(viewQuery.createdAt) },
                { label: "Company", value: viewQuery.companyName },
                {
                  label: "E-Mail",
                  value: <a href={`mailto:${viewQuery.email}`}>{viewQuery.email}</a>,
                },
                {
                  label: "Phone",
                  value: <a href={`tel:${viewQuery.phoneNo}`}>{viewQuery.phoneNo}</a>,
                },
              ].map((row) => (
                <Box key={row.label} sx={{ display: "flex", gap: 2, mb: 1.5 }}>
                  <Typography sx={{ width: 90, flexShrink: 0, color: "#646464", fontWeight: 600 }}>
                    {row.label}
                  </Typography>
                  <Typography component="div" sx={{ wordBreak: "break-word" }}>
                    {row.value}
                  </Typography>
                </Box>
              ))}
              <Typography sx={{ color: "#646464", fontWeight: 600, mt: 2, mb: 1 }}>
                Description
              </Typography>
              <Box
                sx={{
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  backgroundColor: "#f5f7fa",
                  borderRadius: "8px",
                  p: 2,
                  minHeight: 60,
                }}
              >
                {viewQuery.description || "-"}
              </Box>
            </DialogContent>
          </>
        )}
      </IModal>
      <DeleteModal
        open={Boolean(deleteId)}
        handleClose={() => setDeleteId("")}
        onConfirm={onConfirmDelete}
        loading={isDeleteLoading}
      />
      <ToastContainer />
    </>
  );
};

export default ContactQueries;
