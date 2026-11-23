"use client";

import { Box, Button, Card, CardContent, Grid, TextField } from "@mui/material";
import Title from "@/app/components/title.components";
import { SVG } from "@/app/components/icon";
import { useEffect, useState } from "react";
import {
  EditContents,
  getAllContents,
} from "@/app/api/manageContent/manageContent";
import CustomLoader from "@/app/components/SpinLoader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type NewsletterFields = { newsletterText: string; newsletterNote: string };

const FIELDS: {
  key: keyof NewsletterFields;
  label: string;
  placeholder: string;
  rows: number;
}[] = [
  {
    key: "newsletterText",
    label: "Description (above the e-mail field)",
    placeholder:
      "Hol’ dir aktuelle Neuigkeiten über die angesagtesten Geschäfte & Gutscheinaktionen in deiner Region …",
    rows: 5,
  },
  {
    key: "newsletterNote",
    label: "Note (below the form)",
    placeholder:
      "*Anmerkung: Du kannst dich jederzeit wieder abmelden. Deine Daten geben wir nicht an Dritte weiter.",
    rows: 3,
  },
];

// Text of the newsletter sign-up box on the website
const NewsletterText = () => {
  const [loading, setIsLoading] = useState(true);
  const [editLoading, setEditLoading] = useState(false);
  const [id, setId] = useState("");
  const [values, setValues] = useState<NewsletterFields>({
    newsletterText: "",
    newsletterNote: "",
  });

  useEffect(() => {
    (async () => {
      const response = await getAllContents();
      if (response.remote === "success" && response.data.data) {
        const data = response.data.data;
        setId(data.id);
        setValues({
          newsletterText: data.newsletterText ?? "",
          newsletterNote: data.newsletterNote ?? "",
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
      toast.error("Error updating the newsletter text");
    }
    setEditLoading(false);
  };

  return (
    <>
      {loading && <CustomLoader />}
      <Title heading="Newsletter Text" />
      <Card elevation={0} sx={{ borderRadius: "10px", mb: 2 }}>
        <CardContent>
          <Grid container spacing={2}>
            {FIELDS.map((field) => (
              <Grid item xs={12} key={field.key}>
                <Box component="label" sx={{ display: "block", mb: 0.5, fontWeight: 600 }}>
                  {field.label}
                </Box>
                <TextField
                  fullWidth
                  multiline
                  minRows={field.rows}
                  placeholder={field.placeholder}
                  value={values[field.key]}
                  onChange={(e) =>
                    setValues((prev) => ({ ...prev, [field.key]: e.target.value }))
                  }
                />
              </Grid>
            ))}
          </Grid>
        </CardContent>
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

export default NewsletterText;
