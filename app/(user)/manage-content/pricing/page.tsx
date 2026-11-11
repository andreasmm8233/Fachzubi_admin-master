"use client";

import {
  Box,
  Button,
  Card,
  Checkbox,
  Chip,
  FormControlLabel,
  CardContent,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Title from "@/app/components/title.components";
import { SVG } from "@/app/components/icon";
import { useEffect, useState } from "react";
import TextEditor from "../textEditor/textEditor";
import {
  EditContents,
  getAllContents,
} from "@/app/api/manageContent/manageContent";
import {
  PricingPlan,
  PricingPlanInput,
  addPricingPlan,
  deletePricingPlan,
  getPricingPlans,
  updatePricingPlan,
} from "@/app/api/pricing/pricing";
import CustomLoader from "@/app/components/SpinLoader";
import IModal from "@/app/components/modal.components";
import DeleteModal from "@/app/components/delete.modal.components";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Form state: price is kept as text so the field can be cleared while typing
type PlanForm = Omit<PricingPlanInput, "price"> & { price: string };

const EMPTY_PLAN: PlanForm = {
  name: "",
  description: "",
  price: "",
  duration: "month",
  features: [""],
  sortOrder: 0,
  highlighted: false,
  priceNote: "",
  buttonText: "",
  badgeText: "",
};

const DURATION_LABEL = { month: "per month", year: "per year" };

const actionSx = { color: "#0096A4", px: 0, "&:hover": { color: "#F1841D" } };

// Pricing page of the website (/preise): heading, description and plans
const PricingPage = () => {
  const [loading, setLoading] = useState(true);
  const [contentId, setContentId] = useState("");
  const [heading, setHeading] = useState("");
  const [description, setDescription] = useState("");
  const [textSaving, setTextSaving] = useState(false);

  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null); // "" = new plan
  const [form, setForm] = useState<PlanForm>(EMPTY_PLAN);
  const [formError, setFormError] = useState("");
  const [planSaving, setPlanSaving] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  const loadPlans = async () => {
    const response = await getPricingPlans();
    if (response.remote === "success") setPlans(response.data.data);
  };

  useEffect(() => {
    (async () => {
      const response = await getAllContents();
      if (response.remote === "success") {
        setContentId(response.data.data.id);
        setHeading(response.data.data.pricingHeading ?? "");
        setDescription(response.data.data.pricingDescription ?? "");
      }
      await loadPlans();
      setLoading(false);
    })();
  }, []);

  const saveTexts = async () => {
    setTextSaving(true);
    const response = await EditContents({
      id: contentId,
      pricingHeading: heading,
      pricingDescription: description,
    });
    if (response.remote === "success") toast.info("update successfully!");
    else toast.error("Error updating the pricing page");
    setTextSaving(false);
  };

  const openPlan = (plan?: PricingPlan) => {
    setFormError("");
    setEditingId(plan?._id ?? "");
    setForm(
      plan
        ? {
            name: plan.name,
            description: plan.description ?? "",
            price: String(plan.price),
            duration: plan.duration,
            features: plan.features.length ? plan.features : [""],
            sortOrder: plan.sortOrder ?? 0,
            highlighted: Boolean(plan.highlighted),
            priceNote: plan.priceNote ?? "",
            buttonText: plan.buttonText ?? "",
            badgeText: plan.badgeText ?? "",
          }
        : { ...EMPTY_PLAN, sortOrder: plans.length + 1 }
    );
  };

  const setFeature = (index: number, value: string) =>
    setForm((prev) => ({
      ...prev,
      features: prev.features.map((f, i) => (i === index ? value : f)),
    }));

  const savePlan = async () => {
    const price = Number(form.price.replace(",", "."));
    if (!form.name.trim()) return setFormError("Name is required");
    if (form.price.trim() === "" || Number.isNaN(price) || price < 0)
      return setFormError("Please enter a valid price");

    setPlanSaving(true);
    const payload: PricingPlanInput = {
      ...form,
      name: form.name.trim(),
      description: form.description.trim(),
      priceNote: form.priceNote.trim(),
      buttonText: form.buttonText.trim(),
      badgeText: form.badgeText.trim(),
      price,
      features: form.features.map((f) => f.trim()).filter(Boolean),
    };
    const response = editingId
      ? await updatePricingPlan(editingId, payload)
      : await addPricingPlan(payload);
    setPlanSaving(false);
    if (response.remote === "success") {
      toast.info(editingId ? "Plan updated successfully!" : "Plan added successfully!");
      setEditingId(null);
      await loadPlans();
    } else {
      setFormError("Error saving the plan");
    }
  };

  const confirmDelete = async () => {
    setDeleteLoading(true);
    const response = await deletePricingPlan(deleteId);
    if (response.remote === "success") {
      toast.info("Plan deleted successfully!");
      await loadPlans();
    } else {
      toast.error("Error deleting the plan");
    }
    setDeleteLoading(false);
    setDeleteId("");
  };

  return (
    <>
      {loading && <CustomLoader />}
      <Title heading="Pricing Page Heading" />
      <Card elevation={0} sx={{ borderRadius: "10px", mb: 2 }}>
        <TextEditor content={heading} setContent={setHeading} />
      </Card>
      <Title heading="Pricing Page Description" />
      <Card elevation={0} sx={{ borderRadius: "10px", mb: 2 }}>
        <TextEditor content={description} setContent={setDescription} />
      </Card>
      <Box sx={{ textAlign: "right", mb: 4 }}>
        <Button variant="outlined" sx={{ fontWeight: "700" }} onClick={saveTexts}>
          <SVG.Save style={{ marginRight: "10px" }} /> {textSaving ? "Update..." : "Update"}
        </Button>
      </Box>

      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Title heading="Plans" />
        <Button
          onClick={() => openPlan()}
          disableRipple={true}
          sx={{ fontSize: "20px", color: "#646464", "&:hover": { color: "#0096A4" } }}
        >
          <SVG.AddIcon style={{ marginRight: "8px" }} /> Add Plan
        </Button>
      </Stack>
      {plans.length === 0 && !loading && (
        <Card elevation={0} sx={{ borderRadius: "10px" }}>
          <CardContent sx={{ color: "#646464" }}>No plans yet. Click „Add Plan“ to create one.</CardContent>
        </Card>
      )}
      <Grid container spacing={2}>
        {plans.map((plan) => (
          <Grid item xs={12} md={6} lg={4} key={plan._id}>
            <Card elevation={0} sx={{ borderRadius: "10px", height: "100%" }}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <Typography sx={{ fontWeight: 700, fontSize: "20px" }}>
                      {plan.name}
                      {plan.highlighted && (
                        <Chip label={plan.badgeText || "Unsere Empfehlung"} size="small" sx={{ ml: 1, backgroundColor: "#F1841D", color: "#fff", fontWeight: 700 }} />
                      )}
                    </Typography>
                    <Typography sx={{ fontWeight: 700, color: "#0096A4", fontSize: "18px" }}>
                      {plan.price.toLocaleString("de-DE")} € {DURATION_LABEL[plan.duration]}
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={2}>
                    <IconButton disableRipple aria-label="Edit plan" onClick={() => openPlan(plan)} sx={actionSx}>
                      <SVG.Edit />
                    </IconButton>
                    <IconButton disableRipple aria-label="Delete plan" onClick={() => setDeleteId(plan._id)} sx={actionSx}>
                      <SVG.Delete />
                    </IconButton>
                  </Stack>
                </Stack>
                {plan.description && (
                  <Typography sx={{ color: "#646464", fontSize: "14px", mt: 1 }}>{plan.description}</Typography>
                )}
                <Box component="ul" sx={{ pl: 2.5, mb: 0, fontSize: "14px" }}>
                  {plan.features.map((feature, i) =>
                    feature.startsWith("#") ? (
                      <Box component="li" key={i} sx={{ listStyle: "none", ml: -2.5, mt: 1, fontWeight: 700 }}>
                        {feature.replace(/^#+\s*/, "")}
                      </Box>
                    ) : (
                      <li key={i}>{feature}</li>
                    )
                  )}
                </Box>
                <Typography sx={{ color: "#a0a0a0", fontSize: "12px", mt: 1 }}>Order: {plan.sortOrder}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <IModal open={editingId !== null} handleClose={() => setEditingId(null)} maxWidth="600px">
        <DialogTitle sx={{ fontWeight: 700, pr: 6 }}>
          {editingId ? "Edit Plan" : "Add Plan"}
          <IconButton aria-label="Close" onClick={() => setEditingId(null)} sx={{ position: "absolute", right: 12, top: 12 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            <TextField label="Name" fullWidth value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <TextField
              label="Description"
              fullWidth
              multiline
              minRows={2}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <Stack direction="row" spacing={2}>
              <TextField
                label="Price (€)"
                fullWidth
                inputMode="decimal"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
              <TextField
                select
                label="Duration"
                fullWidth
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value as PlanForm["duration"] })}
              >
                <MenuItem value="month">Month</MenuItem>
                <MenuItem value="year">Year</MenuItem>
              </TextField>
              <TextField
                label="Order"
                type="number"
                sx={{ width: 110, flexShrink: 0 }}
                value={form.sortOrder}
                onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) || 0 })}
              />
            </Stack>
            <TextField
              label="Price Note (optional)"
              placeholder="18,00 € Ersparnis im Jahr"
              fullWidth
              value={form.priceNote}
              onChange={(e) => setForm({ ...form, priceNote: e.target.value })}
            />
            <TextField
              label="Button Text (optional)"
              placeholder={`Jetzt ${form.name || "Basic"}-Tarif starten`}
              fullWidth
              value={form.buttonText}
              onChange={(e) => setForm({ ...form, buttonText: e.target.value })}
            />
            <Box>
              <Typography sx={{ fontWeight: 600 }}>Features</Typography>
              <Typography sx={{ color: "#646464", fontSize: "13px", mb: 1 }}>
                Start a line with # to make it a section heading, e.g. „# Grundfunktionen“.
              </Typography>
              <Stack spacing={1}>
                {form.features.map((feature, index) => (
                  <Stack direction="row" spacing={1} alignItems="center" key={index}>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder={`Feature ${index + 1}`}
                      value={feature}
                      onChange={(e) => setFeature(index, e.target.value)}
                    />
                    <IconButton
                      aria-label="Remove feature"
                      onClick={() =>
                        setForm((prev) => ({ ...prev, features: prev.features.filter((_, i) => i !== index) }))
                      }
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                ))}
              </Stack>
              <Button
                size="small"
                variant="outlined"
                sx={{ mt: 1 }}
                onClick={() => setForm((prev) => ({ ...prev, features: [...prev.features, ""] }))}
              >
                Add Feature
              </Button>
            </Box>
            <FormControlLabel
              control={
                <Checkbox
                  checked={form.highlighted}
                  onChange={(e) => setForm({ ...form, highlighted: e.target.checked })}
                />
              }
              label="Highlight this plan (coloured card with a badge on the website)"
            />
            {form.highlighted && (
              <TextField
                label="Badge Text (optional)"
                placeholder="Unsere Empfehlung"
                fullWidth
                value={form.badgeText}
                onChange={(e) => setForm({ ...form, badgeText: e.target.value })}
              />
            )}
            {formError && <Typography sx={{ color: "red" }}>{formError}</Typography>}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button variant="outlined" onClick={() => setEditingId(null)}>
            Cancel
          </Button>
          <Button variant="contained" disabled={planSaving} onClick={savePlan}>
            {planSaving ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </IModal>
      <DeleteModal open={Boolean(deleteId)} handleClose={() => setDeleteId("")} onConfirm={confirmDelete} loading={deleteLoading} />
      <ToastContainer />
    </>
  );
};

export default PricingPage;
