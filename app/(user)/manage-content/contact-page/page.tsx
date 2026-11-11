"use client";

import { Box, Button, Card, CardContent, Grid, TextField } from "@mui/material";
import Title from "@/app/components/title.components";
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

type ContactFields = Required<
  Pick<
    ManageContentEditTypes,
    | "contactHeading"
    | "contactDescription"
    | "contactCardTitle"
    | "contactPhone"
    | "contactTiming"
    | "contactEmail"
    | "contactFormText"
  >
>;

const EMPTY: ContactFields = {
  contactHeading: "",
  contactDescription: "",
  contactCardTitle: "",
  contactPhone: "",
  contactTiming: "",
  contactEmail: "",
  contactFormText: "",
};

// Single-line fields shown in the contact box on the website
const TEXT_FIELDS: { key: keyof ContactFields; label: string; placeholder: string }[] = [
  { key: "contactHeading", label: "Page Heading", placeholder: "Kontakt" },
  { key: "contactCardTitle", label: "Contact Box Title", placeholder: "Team kontaktieren" },
  { key: "contactPhone", label: "Phone Number", placeholder: "0761 - 55 77 55 66" },
  { key: "contactTiming", label: "Timing", placeholder: "Mo. - Fr. 9:00 bis 17:00 Uhr" },
  { key: "contactEmail", label: "E-Mail", placeholder: "info@unibonus.app" },
];

// Content of the contact page on the website (/kontakt)
const ContactPage = () => {
  const [loading, setIsLoading] = useState(true);
  const [editLoading, setEditLoading] = useState(false);
  const [id, setId] = useState("");
  const [values, setValues] = useState<ContactFields>(EMPTY);

  const setField = (key: keyof ContactFields) => (value: string) =>
    setValues((prev) => ({ ...prev, [key]: value }));

  useEffect(() => {
    (async () => {
      const response = await getAllContents();
      if (response.remote === "success") {
        const data = response.data.data;
        setId(data.id);
        setValues({
          contactHeading: data.contactHeading ?? "",
          contactDescription: data.contactDescription ?? "",
          contactCardTitle: data.contactCardTitle ?? "",
          contactPhone: data.contactPhone ?? "",
          contactTiming: data.contactTiming ?? "",
          contactEmail: data.contactEmail ?? "",
          contactFormText: data.contactFormText ?? "",
        });
      }
      setIsLoading(false);
    })();
  }, []);

  const handleUpdate = async () => {
    setEditLoading(true);
    const response = await EditContents({ id, ...values });
    if (response.remote === "success") {
      toast.info("update successfully!");
    } else {
      toast.error("Error updating the contact page");
    }
    setEditLoading(false);
  };

  return (
    <>
      {loading && <CustomLoader />}
      <Title heading="Contact Page" />
      <Card elevation={0} sx={{ borderRadius: "10px", mb: 2 }}>
        <CardContent>
          <Grid container spacing={2}>
            {TEXT_FIELDS.map((field) => (
              <Grid item xs={12} md={6} key={field.key}>
                <Box component="label" sx={{ display: "block", mb: 0.5, fontWeight: 600 }}>
                  {field.label}
                </Box>
                <TextField
                  fullWidth
                  placeholder={field.placeholder}
                  value={values[field.key]}
                  onChange={(e) => setField(field.key)(e.target.value)}
                />
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
      <Title heading="Page Description" />
      <Card elevation={0} sx={{ borderRadius: "10px", mb: 2 }}>
        <TextEditor
          content={values.contactDescription}
          setContent={setField("contactDescription")}
        />
      </Card>
      <Title heading="Form Text (below the form)" />
      <Card elevation={0} sx={{ borderRadius: "10px", mb: 2 }}>
        <TextEditor
          content={values.contactFormText}
          setContent={setField("contactFormText")}
        />
      </Card>
      <Box sx={{ textAlign: "right", mt: 3 }}>
        <Button variant="outlined" sx={{ fontWeight: "700" }} onClick={handleUpdate}>
          <SVG.Save style={{ marginRight: "10px" }} />{" "}
          {editLoading ? "Update..." : "Update"}
        </Button>
      </Box>
      <ToastContainer />
    </>
  );
};

export default ContactPage;
