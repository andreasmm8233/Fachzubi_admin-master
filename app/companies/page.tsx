"use client";

import React, { useEffect, useState } from "react";
import { getAllContents } from "@/app/api/manageContent/manageContent";
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
  Autocomplete,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useDebounce } from "@uidotdev/usehooks";
import { getAllPublicEmployers } from "@/app/api/employer/employer";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Employer } from "@/app/api/employer/employer.types";
// REGION FEATURE DISABLED
// import { TransformRegion } from "@/app/api/regions/regions.types";
// import { getRegions } from "@/app/api/regions/regions";
import { getCity } from "@/app/api/city/city";
import { TransformCity } from "@/app/api/city/city.types";

const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_IMAGE_URL || "https://api.webzlab.site/";
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function CompaniesPage() {
  const router = useRouter();
  // Banner texts are managed in admin (Manage Content → Landing Page)
  const [heroText, setHeroText] = useState({ heading: "", subHeading: "" });
  const [heroLoading, setHeroLoading] = useState(true);
  useEffect(() => {
    getAllContents().then((response) => {
      if (response.remote === "success") {
        setHeroText({
          heading: response.data.data.companiesHeading ?? "",
          subHeading: response.data.data.companiesSubHeading ?? "",
        });
      }
      setHeroLoading(false);
    });
  }, []);
  // Logged-in users go back to the dashboard, logged-out users go back to login.
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchValue, setSearchValue] = useState<string>("");
  const [pageNo, setPageNo] = useState<number>(1);
  const [isInitialized, setIsInitialized] = useState(false);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  // REGION FEATURE DISABLED
  // const [regions, setRegions] = useState<TransformRegion[]>([]);
  // const [selectedRegion, setSelectedRegion] = useState<string>("");
  // const [regionObj, setRegionObj] = useState<TransformRegion | null>(null);
  const [cities, setCities] = useState<TransformCity[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [cityObj, setCityObj] = useState<TransformCity | null>(null);
  const debouncedSearchTerm = useDebounce(searchValue, 500);

  const fetchCompanies = async () => {
    if (!isInitialized) return;
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

    // REGION FEATURE DISABLED
    // if (selectedRegion) {
    //   payload.selectedRegion = selectedRegion;
    // }

    if (selectedCity) {
      payload.slectedCity = selectedCity;
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
    // REGION FEATURE DISABLED
    // const fetchRegions = async () => {
    //   try {
    //     const response = await getRegions();
    //     if (response.remote === "success") {
    //       setRegions(response.data.data);
    //     }
    //   } catch (error) {
    //     console.error("Failed to fetch regions", error);
    //   }
    // };
    const fetchCities = async () => {
      try {
        const response = await getCity();
        if (response.remote === "success") {
          setCities(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch cities", error);
      }
    };
    // fetchRegions(); // REGION FEATURE DISABLED
    fetchCities();
  }, []);

  useEffect(() => {
    setPageNo(1);
  }, [debouncedSearchTerm, selectedLetter, /* selectedRegion, */ selectedCity]);

  useEffect(() => {
    fetchCompanies();
  }, [debouncedSearchTerm, pageNo, selectedLetter, /* selectedRegion, */ selectedCity, isInitialized]);

  useEffect(() => {
    // ?city=<cityId> (from the website's city search) preselects the city filter.
    const cityFromUrl = new URLSearchParams(window.location.search).get("city");
    if (cityFromUrl) {
      setSelectedCity(cityFromUrl);
    } else {
      const saved = sessionStorage.getItem("public-companies-page");
      if (saved) {
        setPageNo(Number(saved));
      }
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (selectedCity && !cityObj) {
      setCityObj(cities.find((city) => city.id === selectedCity) ?? null);
    }
  }, [cities, selectedCity, cityObj]);

  useEffect(() => {
    if (isInitialized) {
      sessionStorage.setItem("public-companies-page", String(pageNo));
    }
  }, [pageNo, isInitialized]);

  const handleLetterChange = (event: React.MouseEvent<HTMLElement>, newLetter: string | null) => {
    setSelectedLetter(newLetter);
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f5f7fa", pb: 10 }}>
      {/* Header Section */}
      <Box sx={{ background: "linear-gradient(135deg, #0096A4 0%, #005c66 100%)", py: { xs: 6, md: 8 }, mb: 6 }}>
        <Container maxWidth="md">
          <Typography variant="h3" component="h1" align="center" sx={{ color: "#fff", fontWeight: 800, mb: 2, "& p": { m: 0 } }}>
            {heroText.heading ? (
              <span dangerouslySetInnerHTML={{ __html: heroText.heading }} />
            ) : heroLoading ? null : (
              "Entdecke TOP-Unternehmen"
            )}
          </Typography>
          <Typography variant="h6" component="div" align="center" sx={{ color: "rgba(255,255,255,0.9)", mb: 4, fontWeight: 400, "& p": { m: 0 } }}>
            {heroText.subHeading ? (
              <span dangerouslySetInnerHTML={{ __html: heroText.subHeading }} />
            ) : heroLoading ? null : (
              "Lerne interessante Unternehmen kennen, erhalte spannende Einblicke und entdecke vielfältige Karriere- und Jobmöglichkeiten."
            )}
          </Typography>
          
          <Grid
            container
            spacing={1}
            alignItems="center"
            sx={{
              backgroundColor: "#fff",
              borderRadius: "12px",
              p: 1,
              boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
            }}
          >
            <Grid item xs={12} md={7}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Unternehmen hier eingeben oder freilassen …"
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
                    // fixed height so the search box and the city filter line up
                    height: "56px",
                    py: "0 !important",
                    "& input": { fontSize: "1.1rem", py: 0 },
                  },
                }}
              />
            </Grid>
            {/* REGION FEATURE DISABLED — region filter hidden from the companies list.
            <Grid item xs={12} md={3.5} sx={{ borderLeft: { xs: "none", md: "1px solid #e2e8f0" } }}>
              <Autocomplete
                id="region-filter"
                options={regions}
                getOptionLabel={(option: any) => option.name || ""}
                value={regionObj}
                onChange={(event, newValue) => {
                  setRegionObj(newValue);
                  setSelectedRegion(newValue ? newValue.id : "");
                }}
                isOptionEqualToValue={(option: any, value: any) => option.id === value?.id}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Region auswählen"
                    variant="outlined"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationOnIcon sx={{ color: "#0096A4" }} />
                        </InputAdornment>
                      ),
                      sx: {
                        "& fieldset": { border: "none" },
                        // fixed height so the search box and the city filter line up
                        height: "56px",
                        py: "0 !important",
                        "& input": { fontSize: "1.1rem", py: 0 },
                      },
                    }}
                  />
                )}
              />
            </Grid>
            */}
            <Grid item xs={12} md={5} sx={{ borderLeft: { xs: "none", md: "1px solid #e2e8f0" } }}>
              <Autocomplete
                id="city-filter"
                options={cities}
                getOptionLabel={(option: any) => option.name || ""}
                value={cityObj}
                onChange={(event, newValue) => {
                  setCityObj(newValue);
                  setSelectedCity(newValue ? newValue.id : "");
                }}
                isOptionEqualToValue={(option: any, value: any) => option.id === value?.id}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Stadt auswählen"
                    variant="outlined"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationOnIcon sx={{ color: "#0096A4" }} />
                        </InputAdornment>
                      ),
                      sx: {
                        "& fieldset": { border: "none" },
                        // fixed height so the search box and the city filter line up
                        height: "56px",
                        py: "0 !important",
                        "& input": { fontSize: "1.1rem", py: 0 },
                      },
                    }}
                  />
                )}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="lg">
        {/* Alphabet Filter */}
        <Box sx={{ mb: 6 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 2, mb: 2 }}>
            <Typography variant="subtitle2" sx={{ color: "#718096", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px" }}>
              Unternehmen von A bis Z
            </Typography>
            {!loading && companies.length > 0 && (
              <Pagination
                count={totalPages}
                page={pageNo}
                onChange={(e, value) => setPageNo(value)}
                color="primary"
                shape="rounded"
                sx={{
                  // 30% larger than MUI's default (0.875rem text, 32px items)
                  "& .MuiPaginationItem-root": {
                    fontSize: "1.14rem",
                    minWidth: "42px",
                    height: "42px",
                  },
                  "& .MuiPaginationItem-icon": {
                    fontSize: "1.6rem",
                  },
                  "& .MuiPaginationItem-root.Mui-selected": {
                    backgroundColor: "#0096A4",
                    color: "#fff",
                  },
                }}
              />
            )}
          </Box>
          <ToggleButtonGroup
            value={selectedLetter}
            exclusive
            onChange={handleLetterChange}
            aria-label="letter filter"
            sx={{ 
              display: "flex", 
              flexWrap: "nowrap", 
              overflowX: "auto", 
              gap: 0.5, 
              "& .MuiToggleButtonGroup-grouped": {
                border: "1px solid #e2e8f0 !important",
                borderRadius: "8px !important",
                m: "0 !important",
                flex: "1 0 auto",
                minWidth: "34px",
                px: 1,
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
            <Typography variant="h5" sx={{ color: "#4a5568", fontWeight: 600, mb: 1 }}>Es wurden keine Unternehmen gefunden.</Typography>
            <Typography variant="body1" sx={{ color: "#718096" }}>Passen Sie Ihre Suche oder Filter an, um das Gewünschte zu finden.</Typography>
            {(searchValue || selectedLetter || /* selectedRegion || */ selectedCity) && (
              <Button
                variant="outlined"
                onClick={() => {
                  setSearchValue("");
                  setSelectedLetter(null);
                  // REGION FEATURE DISABLED
                  // setSelectedRegion("");
                  // setRegionObj(null);
                  setSelectedCity("");
                  setCityObj(null);
                }} 
                sx={{ textTransform: "none", mt: 3, borderColor: "#0096A4", color: "#0096A4" }}
              >
                Filter zurücksetzen
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
                // 30% larger than MUI's default (0.875rem text, 32px items)
                "& .MuiPaginationItem-root": {
                  fontSize: "1.14rem",
                  minWidth: "42px",
                  height: "42px",
                },
                "& .MuiPaginationItem-icon": {
                  fontSize: "1.6rem",
                },
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
