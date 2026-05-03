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
  Chip,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import WorkIcon from "@mui/icons-material/Work";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import BusinessIcon from "@mui/icons-material/Business";
import { useDebounce } from "@uidotdev/usehooks";
import { getAllJobs } from "@/app/api/jobs/jobs";
import { useRouter } from "next/navigation";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function JobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchValue, setSearchValue] = useState<string>("");
  const [pageNo, setPageNo] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  
  const debouncedSearchTerm = useDebounce(searchValue, 500);

  const fetchJobs = async () => {
    setLoading(true);
    const payload: any = {
      searchValue: debouncedSearchTerm,
      pageNo: pageNo,
      recordPerPage: "12",
    };

    if (selectedLetter) {
      payload.letter = selectedLetter;
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
    setPageNo(1);
  }, [debouncedSearchTerm, selectedLetter]);

  useEffect(() => {
    fetchJobs();
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
            Find Your Dream Job
          </Typography>
          <Typography variant="h6" align="center" sx={{ color: "rgba(255,255,255,0.9)", mb: 4, fontWeight: 400 }}>
            Browse through thousands of open positions
          </Typography>
          
          <Box sx={{ backgroundColor: "#fff", borderRadius: "12px", p: 1, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search jobs by title, keyword..."
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
            Filter by Job Title
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

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 10 }}>
            <CircularProgress sx={{ color: "#0096A4" }} />
          </Box>
        ) : jobs.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 10, backgroundColor: "#fff", borderRadius: "16px", border: "1px dashed #cbd5e0" }}>
            <SearchIcon sx={{ fontSize: 60, color: "#e2e8f0", mb: 2 }} />
            <Typography variant="h5" sx={{ color: "#4a5568", fontWeight: 600, mb: 1 }}>No jobs found</Typography>
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
              const jobType = job.jobTypeName || job.jobType?.name || (typeof job.jobType === "string" ? null : null);
              const jobCity = Array.isArray(job.city) ? job.city.map((c: any) => Array.isArray(c) ? c.join(', ') : c?.name || c).join(', ') : (job.city?.name || job.location || "Various Locations");
              const startDate = job.startDate ? new Date(job.startDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : "";
              
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
                        {jobType && (
                          <Chip label={jobType} size="small" sx={{ backgroundColor: "#e6fffa", color: "#0096A4", fontWeight: 700, mb: 2, borderRadius: "6px" }} />
                        )}
                        
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
                          {startDate && (
                            <Typography variant="body2" sx={{ color: "#718096", display: "flex", alignItems: "center", gap: 1 }}>
                              <CalendarMonthIcon fontSize="small" sx={{ color: "#a0aec0" }} /> Start: {startDate}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                      
                      <Box sx={{ mt: 3, pt: 2, borderTop: "1px solid #edf2f7", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        {job.salary && (
                          <Typography variant="subtitle2" sx={{ color: "#2d3748", fontWeight: 700 }}>
                            {job.salary}
                          </Typography>
                        )}
                        <Button variant="text" size="small" sx={{ color: "#0096A4", fontWeight: 700, p: 0, minWidth: "auto", marginLeft: job.salary ? 0 : "auto", "&:hover": { backgroundColor: "transparent", textDecoration: "underline" } }}>
                          View Details &rarr;
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
