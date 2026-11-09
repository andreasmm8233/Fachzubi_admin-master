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
  Chip,
  ToggleButton,
  ToggleButtonGroup,
  Autocomplete,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import WorkIcon from "@mui/icons-material/Work";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import BusinessIcon from "@mui/icons-material/Business";
import { useDebounce } from "@uidotdev/usehooks";
import { getAllJobs } from "@/app/api/jobs/jobs";
import { useRouter } from "next/navigation";
// REGION FEATURE DISABLED
// import { TransformRegion } from "@/app/api/regions/regions.types";
// import { getRegions } from "@/app/api/regions/regions";
import { getCity } from "@/app/api/city/city";
import { TransformCity } from "@/app/api/city/city.types";

const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_IMAGE_URL || "https://api.webzlab.site/";
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function JobsPage() {
  const router = useRouter();
  // Banner texts are managed in admin (Manage Content → Landing Page)
  const [heroText, setHeroText] = useState({ heading: "", subHeading: "" });
  const [heroLoading, setHeroLoading] = useState(true);
  useEffect(() => {
    getAllContents().then((response) => {
      if (response.remote === "success") {
        setHeroText({
          heading: response.data.data.jobsHeading ?? "",
          subHeading: response.data.data.jobsSubHeading ?? "",
        });
      }
      setHeroLoading(false);
    });
  }, []);
  // Logged-in users go back to the dashboard, logged-out users go back to login.
  const [jobs, setJobs] = useState<any[]>([]);
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

  const fetchJobs = async () => {
    if (!isInitialized) return;
    setLoading(true);
    const payload: any = {
      searchValue: debouncedSearchTerm,
      pageNo: pageNo,
      recordPerPage: "12",
    };

    if (selectedLetter) {
      payload.letter = selectedLetter;
    }

    // REGION FEATURE DISABLED
    // if (selectedRegion) {
    //   payload.region = selectedRegion;
    // }

    if (selectedCity) {
      payload.slectedCity = selectedCity;
    }

    try {
      const response = await getAllJobs(payload);
      if (response.remote === "success") {
        const responseData = response.data.data as any;
        const jobsData = responseData.data || [];
        const count = responseData.count || responseData.total || 0;
        const apiTotalPages = responseData.totalPages;
        setJobs(jobsData);
        setTotalPages(apiTotalPages || Math.ceil(count / 12) || 1);
      } else {
        console.error("Failed to fetch jobs", response.error);
        setJobs([]);
      }
    } catch (error) {
      console.error(error);
      setJobs([]);
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
    fetchJobs();
  }, [debouncedSearchTerm, pageNo, selectedLetter, /* selectedRegion, */ selectedCity, isInitialized]);

  useEffect(() => {
    const saved = sessionStorage.getItem("public-jobs-page");
    if (saved) {
      setPageNo(Number(saved));
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      sessionStorage.setItem("public-jobs-page", String(pageNo));
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
              "Finde deinen Traumjob!"
            )}
          </Typography>
          <Typography variant="h6" component="div" align="center" sx={{ color: "rgba(255,255,255,0.9)", mb: 4, fontWeight: 400, "& p": { m: 0 } }}>
            {heroText.subHeading ? (
              <span dangerouslySetInnerHTML={{ __html: heroText.subHeading }} />
            ) : heroLoading ? null : (
              "Entdecke attraktive Stellenangebote und vielfältige Karrieremöglichkeiten."
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
                placeholder="Jobtitel oder Stichwort eingeben oder freilassen …"
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
            </Grid>
            {/* REGION FEATURE DISABLED — region filter hidden from the jobs list.
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
                        "& input": { fontSize: "1.1rem", py: 1.5 },
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
                        "& input": { fontSize: "1.1rem", py: 1.5 },
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
              Jobs von A bis Z
            </Typography>
            {!loading && jobs.length > 0 && (
              <Pagination
                count={totalPages}
                page={pageNo}
                onChange={(e, value) => setPageNo(value)}
                color="primary"
                shape="rounded"
                size="large"
                sx={{
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

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 10 }}>
            <CircularProgress sx={{ color: "#0096A4" }} />
          </Box>
        ) : jobs.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 10, backgroundColor: "#fff", borderRadius: "16px", border: "1px dashed #cbd5e0" }}>
            <SearchIcon sx={{ fontSize: 60, color: "#e2e8f0", mb: 2 }} />
            <Typography variant="h5" sx={{ color: "#4a5568", fontWeight: 600, mb: 1 }}>Es wurden keine Jobs gefunden.</Typography>
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
        ) : (
          <Grid container spacing={3}>
            {jobs.map((job, index) => {
              const jobTitle = job.jobTitle || job.title || "Position Available";
              let companyName = "Unknown Company";
              if (typeof job.company === "string") {
                companyName = job.company;
              } else if (job.company?.companyName || job.company?.name) {
                companyName = job.company.companyName || job.company.name;
              }
              const jobTypes: string[] = (Array.isArray(job.jobTypeName) ? job.jobTypeName : [job.jobTypeName || job.jobType?.name]).filter(Boolean);
              const jobCity = Array.isArray(job.city) ? job.city.map((c: any) => Array.isArray(c) ? c.join(', ') : c?.name || c).join(', ') : (job.city?.name || job.location || "Various Locations");
              const startDate = job.startDate ? new Date(job.startDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : "";
              const logoPath = typeof job.companyLogo === "object" ? job.companyLogo?.filepath : job.companyLogo;
              const logoUrl = logoPath ? `${IMAGE_BASE_URL}${logoPath}`.replace(/([^:]\/)\/+/g, "$1") : "/fevicon.png";

              return (
                <Grid item xs={12} md={6} lg={4} key={job._id || job.id || index}>
                  <Card
                    onClick={() => {
                      const id = job._id || job.id;
                      if (id) {
                        router.push(`/jobs/${id}`);
                      }
                    }}
                    sx={{
                      borderRadius: "16px",
                      boxShadow: "0 4px 15px rgba(0,0,0,0.03)",
                      transition: "all 0.3s ease",
                      border: "1px solid transparent",
                      cursor: "pointer",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: "0 12px 25px rgba(0,96,164,0.1)",
                        borderColor: "rgba(0,150,164,0.2)"
                      }
                    }}
                  >
                    <CardContent sx={{ p: 3, display: "flex", flexDirection: "column", flexGrow: 1 }}>
                      <Box sx={{ mb: "auto" }}>
                        <Typography variant="h6" sx={{ fontWeight: 800, color: "#1a202c", mb: 1.5, lineHeight: 1.3 }}>
                          {jobTitle}
                        </Typography>

                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mb: 3 }}>
                          <Typography variant="body2" sx={{ color: "#4a5568", display: "flex", alignItems: "center", gap: 1, fontWeight: 500 }}>
                            <BusinessIcon fontSize="small" sx={{ color: "#a0aec0" }} /> {companyName}
                          </Typography>
                          <Typography variant="body2" sx={{ color: "#718096", display: "flex", alignItems: "center", gap: 1 }}>
                            <LocationOnIcon fontSize="small" sx={{ color: "#a0aec0" }} /> {jobCity}
                          </Typography>
                          {jobTypes.length > 0 && (
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                              {jobTypes.map((type) => (
                                <Chip key={type} label={type} size="small" sx={{ backgroundColor: "#e6fffa", color: "#0096A4", fontWeight: 700, borderRadius: "4px" }} />
                              ))}
                            </Box>
                          )}
                          {/* {startDate && (
                            <Typography variant="body2" sx={{ color: "#718096", display: "flex", alignItems: "center", gap: 1 }}>
                              <CalendarMonthIcon fontSize="small" sx={{ color: "#a0aec0" }} /> Start: {startDate}
                            </Typography>
                          )} */}
                        </Box>
                      </Box>

                      <Box sx={{ mt: 3, pt: 2, borderTop: "1px solid #edf2f7", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0 }}>
                          <Box
                            sx={{
                              width: 56,
                              height: 56,
                              flexShrink: 0,
                              backgroundColor: "#fff",
                              border: "1px solid #edf2f7",
                              borderRadius: "6px",
                              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              p: 0.75,
                            }}
                          >
                            <Box
                              component="img"
                              src={logoUrl}
                              alt={`${companyName} Logo`}
                              onError={(e: any) => {
                                e.target.src = "/fevicon.png";
                              }}
                              sx={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                            />
                          </Box>
                          {job.salary && (
                            <Typography variant="subtitle2" sx={{ color: "#2d3748", fontWeight: 700 }}>
                              {job.salary}
                            </Typography>
                          )}
                        </Box>
                        <Button variant="text" size="small" endIcon={<ArrowForwardIcon sx={{ fontSize: "16px !important" }} />} sx={{ textTransform: "none", color: "#0096A4", fontWeight: 700, fontSize: "14px", p: 0, minWidth: "auto", flexShrink: 0, "&:hover": { backgroundColor: "transparent", textDecoration: "underline" } }}>
                          Mehr erfahren
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}

        {/* Pagination Section */}
        {!loading && jobs.length > 0 && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
            <Pagination
              count={totalPages}
              page={pageNo}
              onChange={(e, value) => setPageNo(value)}
              color="primary"
              shape="rounded"
              size="large"
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
