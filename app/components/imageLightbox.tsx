"use client";

import React, { useEffect } from "react";
import { Box, Dialog, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

interface ImageLightboxProps {
  images: string[];
  // Index of the open image, or null when the popup is closed.
  index: number | null;
  onClose: () => void;
  onChange: (index: number) => void;
}

const navButtonSx = {
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  color: "#fff",
  backgroundColor: "rgba(0,0,0,0.45)",
  "&:hover": { backgroundColor: "rgba(0,0,0,0.7)" },
};

// Full-screen image popup for galleries: arrows / ← → keys to browse,
// close with ✕, Esc or a click on the backdrop.
const ImageLightbox = ({ images, index, onClose, onChange }: ImageLightboxProps) => {
  const open = index !== null && images.length > 0;
  const hasMany = images.length > 1;

  const showPrev = () => {
    if (index !== null) onChange((index - 1 + images.length) % images.length);
  };
  const showNext = () => {
    if (index !== null) onChange((index + 1) % images.length);
  };

  useEffect(() => {
    if (!open || !hasMany) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      PaperProps={{
        sx: { backgroundColor: "transparent", boxShadow: "none", m: 1, overflow: "visible" },
      }}
      slotProps={{ backdrop: { sx: { backgroundColor: "rgba(0,0,0,0.85)" } } }}
    >
      {open && (
        <Box sx={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Box
            component="img"
            src={images[index]}
            alt={`Bild ${index + 1}`}
            sx={{
              display: "block",
              // Scale small uploads up too, keeping the aspect ratio
              width: { xs: "92vw", md: "min(80vw, 1000px)" },
              height: { xs: "auto", md: "min(85vh, 750px)" },
              maxHeight: "85vh",
              objectFit: "contain",
              borderRadius: "6px",
            }}
          />
          <IconButton
            aria-label="Schließen"
            onClick={onClose}
            sx={{ ...navButtonSx, top: 8, right: 8, transform: "none" }}
          >
            <CloseIcon />
          </IconButton>
          {hasMany && (
            <>
              <IconButton aria-label="Vorheriges Bild" onClick={showPrev} sx={{ ...navButtonSx, left: 8 }}>
                <ChevronLeftIcon fontSize="large" />
              </IconButton>
              <IconButton aria-label="Nächstes Bild" onClick={showNext} sx={{ ...navButtonSx, right: 8 }}>
                <ChevronRightIcon fontSize="large" />
              </IconButton>
              <Typography
                sx={{
                  position: "absolute",
                  bottom: 8,
                  left: "50%",
                  transform: "translateX(-50%)",
                  color: "#fff",
                  fontSize: "14px",
                  fontWeight: 600,
                  px: 1.5,
                  py: 0.5,
                  borderRadius: "6px",
                  backgroundColor: "rgba(0,0,0,0.55)",
                }}
              >
                {index + 1} / {images.length}
              </Typography>
            </>
          )}
        </Box>
      )}
    </Dialog>
  );
};

export default ImageLightbox;
