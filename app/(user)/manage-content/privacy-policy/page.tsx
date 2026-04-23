"use client";
import { Card, CardContent, Stack, Typography } from "@mui/material";
import Title from "@/app/components/title.components";

import { Box, Button, Grid } from "@mui/material";

import { SVG } from "@/app/components/icon";
import { useEffect, useState } from "react";
import TextEditor from "../textEditor/textEditor";
import {
  EditContents,
  getAllContents,
} from "@/app/api/manageContent/manageContent";
import CustomLoader from "@/app/components/SpinLoader";
import { ManageContentEditTypes } from "@/app/api/manageContent/manageContent.Types";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const PrivancyPolicy = () => {
  const [content, setContent] = useState("");
  const [id, setId] = useState("");
  const [loading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [alertVariant, setAlertVariant] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const handleGetAllContent = async () => {
    setIsLoading(true);
    const response = await getAllContents();
    if (response.remote === "success") {
      setContent(response.data.data.privacyPolicy);
      setId(response.data.data.id);
    }
    setIsLoading(false);
  };
  const handleUpdate = async () => {
    setEditLoading(true);
    const payload: ManageContentEditTypes = {
      id,
      privacyPolicy: content,
    };
    const response = await EditContents(payload);
    if (response.remote === "success") {
      setError("Success");
      const notify = () => toast.info("Privacy Policy updated successfully!");
      notify();
    } else {
      const notify = () =>
        toast.error("Error updating Terms & Privacy Policy ");
      notify();
    }
    setEditLoading(false);
  };

  useEffect(() => {
    handleGetAllContent();
  }, []);
  return (
    <>
      {loading && <CustomLoader />}
      <Title heading="Privacy Policy" />
      <Card elevation={0} sx={{ borderRadius: "10px" }}>
        <TextEditor content={content} setContent={setContent} />
      </Card>
      <Box sx={{ textAlign: "right", mt: 3 }} onClick={handleUpdate}>
        <Button
          variant="outlined"
          sx={{ fontWeight: "700" }}
          disabled={editLoading}
        >
          <SVG.Save style={{ marginRight: "10px" }} />{" "}
          {editLoading ? "Update..." : "Update"}
        </Button>
      </Box>
      <ToastContainer />
    </>
  );
};

export default PrivancyPolicy;
