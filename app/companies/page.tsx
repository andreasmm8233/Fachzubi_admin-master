"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  InputAdornment,
  TextField,
  Typography,
  CircularProgress,
  Pagination,
  Button,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useDebounce } from "@uidotdev/usehooks";
import { getAllPublicEmployers } from "@/app/api/employer/employer";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Employer } from "@/app/api/employer/employer.types";

const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_IMAGE_URL || "https://api.webzlab.site/";
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function CompaniesPage() {
  const router = useRouter();
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchValue, setSearchValue] = useState<string>("");
  const [pageNo, setPageNo] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const debouncedSearchTerm = useDebounce(searchValue, 500);

  const fetchCompanies = async () => {
    setLoading(true);
    const payload: any = {
      searchValue: debouncedSearchTerm,
      pageNo: pageNo,
      recordPerPage: "12",
      filter: "",
    };

    if (selectedLetter) {
      payload.letter = selectedLetter;
    }

    try {
      const response = await getAllPublicEmployers(payload);
      if (response.remote === "success") {
        let extractedCompanies = [];
        let extractedTotalPages = 1;

        if (response.data?.data?.data && Array.isArray(response.data.data.data)) {
          extractedCompanies = response.data.data.data;
          extractedTotalPages = response.data.data.totalPages || 1;
        } else if (response.data?.data && Array.isArray(response.data.data)) {
          extractedCompanies = response.data.data;
        }

        setCompanies(extractedCompanies);
        setTotalPages(extractedTotalPages);
      } else {
        console.error("Failed to fetch companies", response.error);
        setCompanies([]);
      }
    } catch (error) {
      console.error(error);
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPageNo(1);
  }, [debouncedSearchTerm, selectedLetter]);

  useEffect(() => {
    fetchCompanies();
  }, [debouncedSearchTerm, pageNo, selectedLetter]);

  const handleLetterChange = (event: React.MouseEvent<HTMLElement>, newLetter: string | null) => {
    setSelectedLetter(newLetter);
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f5f7fa", pb: 10, position: "relative" }}>
      {/* Navigation Top Bar */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, p: { xs: 2, md: 3 }, position: "absolute", top: 0, right: 0, width: "100%", zIndex: 10 }}>
        <Button onClick={() => router.push("/companies")} sx={{ color: "#fff", fontWeight: 700, fontSize: "1rem", "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" } }}>Companies</Button>
        <Button onClick={() => router.push("/jobs")} sx={{ color: "#fff", fontWeight: 700, fontSize: "1rem", "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" } }}>Jobs</Button>
      </Box>

      {/* Header Section */}
      <Box sx={{ backgroundColor: "#0096A4", py: { xs: 6, md: 8 }, mb: 6, pt: { xs: 10, md: 10 } }}>
        <Container maxWidth="md">
          <Typography variant="h3" component="h1" align="center" sx={{ color: "#fff", fontWeight: 800, mb: 2 }}>
            Discover Top Companies
          </Typography>
          <Typography variant="h6" align="center" sx={{ color: "rgba(255,255,255,0.9)", mb: 4, fontWeight: 400 }}>
            Search and explore a wide variety of employers offering great opportunities.
          </Typography>
          
          <Box sx={{ backgroundColor: "#fff", borderRadius: "12px", p: 1, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search companies by name..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#0096A4" }} />
                  </InputAdornment>
                ),
                sx: {
                  "& fieldset": { border: "none" },
                  "& input": { fontSize: "1.1rem", py: 1.5 },
                },
              }}
            />
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg">
        {/* Alphabet Filter */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="subtitle2" sx={{ color: "#718096", mb: 2, fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px" }}>
            Filter by Company Name
          </Typography>
          <ToggleButtonGroup
            value={selectedLetter}
            exclusive
            onChange={handleLetterChange}
            aria-label="letter filter"
            sx={{ 
              display: "flex", 
              flexWrap: "wrap", 
              gap: 1, 
              "& .MuiToggleButtonGroup-grouped": {
                border: "1px solid #e2e8f0 !important",
                borderRadius: "8px !important",
                m: "0 !important",
                px: 2,
                py: 1,
                color: "#4a5568",
                fontWeight: 600,
                backgroundColor: "#fff",
                transition: "all 0.2s ease",
                "&.Mui-selected": {
                  backgroundColor: "#0096A4 !important",
                  color: "#fff !important",
                  borderColor: "#0096A4 !important",
                  boxShadow: "0 4px 10px rgba(0,150,164,0.3)"
                },
                "&:hover": {
                  backgroundColor: "#edf2f7"
                }
              }
            }}
          >
            {alphabet.map((letter) => (
              <ToggleButton key={letter} value={letter}>
                {letter}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>

        {/* Loading State */}
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
            <CircularProgress sx={{ color: "#0096A4" }} />
          </Box>
        )}

        {/* Empty State */}
        {!loading && companies.length === 0 && (
          <Box sx={{ textAlign: "center", py: 10, backgroundColor: "#fff", borderRadius: "16px", border: "1px dashed #cbd5e0" }}>
            <SearchIcon sx={{ fontSize: 60, color: "#e2e8f0", mb: 2 }} />
            <Typography variant="h5" sx={{ color: "#4a5568", fontWeight: 600, mb: 1 }}>No companies found</Typography>
            <Typography variant="body1" sx={{ color: "#718096" }}>Try adjusting your search or filters to find what you&apos;re looking for.</Typography>
            {(searchValue || selectedLetter) && (
              <Button 
                variant="outlined" 
                onClick={() => { setSearchValue(""); setSelectedLetter(null); }} 
                sx={{ mt: 3, borderColor: "#0096A4", color: "#0096A4" }}
              >
                Clear Filters
              </Button>
            )}
          </Box>
        )}

        {/* Companies Grid */}
        {!loading && companies.length > 0 && (
          <Grid container spacing={4}>
            {companies.map((company, index) => {
              const companyName = company.companyName || company.name || "Unknown Company";
              
              let logoPath = "";
              if (company.companyLogo && typeof company.companyLogo === "object") {
                logoPath = company.companyLogo.filepath;
              } else {
                logoPath = company.companyLogo || company.logo;
              }
              
              const logoUrl = logoPath ? `${IMAGE_BASE_URL}${logoPath}`.replace(/([^:]\/)\/+/g, "$1") : "/placeholder-logo.png";
              const city = company.city?.name || company.cityName || "Unknown Location";

              return (
                <Grid item xs={12} sm={6} md={4} lg={3} key={company._id || company.id || index}>
                  <Card
                    onClick={() => {
                      const id = company._id || company.id;
                      if (id) {
                        router.push(`/companies/${id}`);
                      }
                    }}
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      aspectRatio: "1/1",
                      borderRadius: "16px",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                      cursor: "pointer",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                      },
                      p: 3,
                    }}
                  >
                    <Box
                      sx={{
                        width: "100%",
                        flex: 1,
                        position: "relative",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        mb: 2,
                      }}
                    >
                      <Box
                        component="img"
                        src={logoUrl}
                        alt={`${companyName} Logo`}
                        onError={(e: any) => {
                          e.target.src = "/fevicon.png";
                        }}
                        sx={{
                          maxWidth: "100%",
                          maxHeight: "120px",
                          objectFit: "contain",
                        }}
                      />
                    </Box>
                    <CardContent sx={{ p: 0, width: "100%", textAlign: "center", "&:last-child": { pb: 0 } }}>
                      <Typography
                        variant="h6"
                        component="h2"
                        sx={{
                          fontWeight: 700,
                          color: "#1a202c",
                          fontSize: "1.1rem",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {companyName}
                      </Typography>
                      {city && city !== "Unknown Location" && (
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#718096",
                            mt: 1,
                            fontWeight: 500,
                          }}
                        >
                          {city}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
        {/* Pagination Section */}
        {!loading && companies.length > 0 && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
            <Pagination
              count={totalPages}
              page={pageNo}
              onChange={(e, value) => setPageNo(value)}
              color="primary"
              shape="rounded"
              sx={{
                "& .MuiPaginationItem-root.Mui-selected": {
                  backgroundColor: "#0096A4",
                  color: "#fff",
                },
              }}
            />
          </Box>
        )}
      </Container>
    </Box>
  );
}
