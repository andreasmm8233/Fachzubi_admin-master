"use client";

import { SVG } from "@/app/components/icon";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import Title from "@/app/components/title.components";
import CustomTable from "@/app/components/table";
import DeleteModal from "@/app/components/delete.modal.components";
import { useEffect, useState } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import {
  NewsletterSubscriber,
  deleteNewsletterSubscriber,
  exportNewsletterSubscribers,
  getNewsletterSubscribers,
} from "@/app/api/newsletter/newsletter";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const COLUMNS = [
  { id: 1, name: "Date", key: "date", width: "25%" },
  { id: 2, name: "E-Mail", key: "email", width: "60%" },
  { id: 3, name: "Action", key: "action", width: "15%" },
];

const formatDate = (value: string) =>
  new Date(value).toLocaleString("de-DE", { dateStyle: "short", timeStyle: "short" });

const actionSx = { color: "#0096A4", px: 0, "&:hover": { color: "#F1841D" } };

// E-mails signed up through the newsletter form on the website
const NewsletterSubscribers = () => {
  const [rows, setRows] = useState<NewsletterSubscriber[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [total, setTotal] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const [recordPerPage, setRecordPerPage] = useState("10");
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearch = useDebounce(searchValue, 300);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const handleGetAll = async () => {
    setLoading(true);
    const response = await getNewsletterSubscribers({
      searchValue: debouncedSearch,
      pageNo,
      recordPerPage,
    });
    if (response.remote === "success") {
      setRows(response.data.data.subscribers);
      setPageCount(response.data.data.count);
      setTotal(response.data.data.total);
    }
    setLoading(false);
  };

  useEffect(() => {
    handleGetAll();
  }, [pageNo, recordPerPage, debouncedSearch]);

  const onConfirmDelete = async () => {
    setIsDeleteLoading(true);
    const response = await deleteNewsletterSubscriber(deleteId);
    if (response.remote === "success") {
      toast.info("Subscriber deleted successfully!");
      await handleGetAll();
    } else {
      toast.error("Error deleting subscriber");
    }
    setIsDeleteLoading(false);
    setDeleteId("");
  };

  // Downloads every subscriber as a CSV file
  const handleExport = async () => {
    setExporting(true);
    const response = await exportNewsletterSubscribers();
    if (response.remote === "success") {
      const lines = [
        "E-Mail;Date",
        ...response.data.data.subscribers.map(
          (s) => `${s.email};${formatDate(s.createdAt)}`
        ),
      ];
      const blob = new Blob(["﻿" + lines.join("\n")], {
        type: "text/csv;charset=utf-8",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `newsletter-subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } else {
      toast.error("Error exporting subscribers");
    }
    setExporting(false);
  };

  const toRow = (subscriber: NewsletterSubscriber) => ({
    id: subscriber._id,
    date: formatDate(subscriber.createdAt),
    email: <a href={`mailto:${subscriber.email}`}>{subscriber.email}</a>,
    action: (
      <IconButton
        disableRipple={true}
        aria-label="Delete subscriber"
        onClick={() => setDeleteId(subscriber._id)}
        sx={actionSx}
      >
        <SVG.Delete />
      </IconButton>
    ),
  });

  return (
    <>
      <Title heading="Newsletter Subscribers" />
      <Stack
        direction={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
        flexWrap={"wrap"}
        gap={2}
        sx={{ mb: 2 }}
      >
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
          placeholder="Search e-mail"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SVG.Search />
              </InputAdornment>
            ),
          }}
          variant="outlined"
        />
        <Stack direction="row" alignItems="center" gap={2}>
          <Typography sx={{ color: "#646464", fontWeight: 600 }}>
            Total: {total}
          </Typography>
          <Button
            variant="outlined"
            sx={{ fontWeight: 700 }}
            onClick={handleExport}
            disabled={exporting || total === 0}
          >
            <FileDownloadOutlinedIcon sx={{ mr: 1 }} />
            {exporting ? "Exporting..." : "Export CSV"}
          </Button>
        </Stack>
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

export default NewsletterSubscribers;
