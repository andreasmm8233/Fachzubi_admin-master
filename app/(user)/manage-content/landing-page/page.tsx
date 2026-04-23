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
import ErrorAlert from "@/themes/overrides/errorAlert";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const LandingPage = () => {
  const [loading, setIsLoading] = useState(true);
  const [id, setId] = useState("");
  const [heading, setHeading] = useState("");
  const [subHeading, setSubHeading] = useState("");
  const [bottomBarText, setBottomBarText] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const handleGetAllContent = async () => {
    setIsLoading(true);
    const response = await getAllContents();
    if (response.remote === "success") {
      setHeading(response.data.data.heading);
      setSubHeading(response.data.data.subHeading);
      setBottomBarText(response.data.data.bottomBarText);
      setId(response.data.data.id);
    }
    setIsLoading(false);
  };
  const handleUpdate = async () => {
    setEditLoading(true);
    const payload: ManageContentEditTypes = {
      id,
      heading,
      subHeading,
      bottomBarText,
    };
    const response = await EditContents(payload);
    if (response.remote === "success") {
      const notify = () => toast.info("update successfully!");
      notify();
    } else {
      const notify = () => toast.error("Error updating a landing page");
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
      <Title heading="Heading" />
      <Card elevation={0} sx={{ borderRadius: "10px", mb:2 }}>
        <TextEditor content={heading} setContent={setHeading} />
      </Card>
      <Title heading="Sub Heading" />
      <Card elevation={0} sx={{ borderRadius: "10px", mb:2 }}>
        <TextEditor content={subHeading} setContent={setSubHeading} />
      </Card>
      <Title heading="Bottom Bar Text" />
      <Card elevation={0} sx={{ borderRadius: "10px", mt:2 }}>
        <TextEditor content={bottomBarText} setContent={setBottomBarText} />
      </Card>
      <Box sx={{ textAlign: "right", mt: 3 }}>
        <Button
          variant="outlined"
          sx={{ fontWeight: "700" }}
          onClick={handleUpdate}
        >
          <SVG.Save style={{ marginRight: "10px" }} />{" "}
          {editLoading ? "Update..." : "Update"}
        </Button>
      </Box>
      <ToastContainer />
    </>
  );
};

export default LandingPage;
