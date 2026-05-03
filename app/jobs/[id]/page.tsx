"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  CircularProgress,
  Button,
  Chip,
  Divider,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BusinessIcon from "@mui/icons-material/Business";
import WorkIcon from "@mui/icons-material/Work";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { useRouter } from "next/navigation";
import { getJobDetailById } from "@/app/api/jobs/jobs";

const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_IMAGE_URL || "https://api.webzlab.site/";

export default function JobDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchJobDetail = async () => {
      try {
        const response = await getJobDetailById(params.id);
        if (response.remote === "success") {
          const data = response.data?.data || response.data;
          setJob(data.job || data);
        } else {
          console.error("Failed to fetch job details", response.error);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetail();
  }, [params.id]);

  if (loading) {
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#f5f7fa" }}>
        <CircularProgress sx={{ color: "#0096A4" }} />
      </Box>
    );
  }

  if (!job) {
    return (
      <Box sx={{ minHeight: "100vh", textAlign: "center", pt: 10, backgroundColor: "#f5f7fa" }}>
        <Typography variant="h5" color="textSecondary">Job not found.</Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={() => router.push("/jobs")} sx={{ mt: 3, color: "#0096A4" }}>
          Back to Jobs
        </Button>
      </Box>
    );
  }

  const jobTitle = job.jobTitle || job.title || "Position Available";
  let companyName = "Unknown Company";
  if (typeof job.company === "string") {
    companyName = job.company;
  } else if (job.company?.companyName || job.company?.name) {
    companyName = job.company.companyName || job.company.name;
  }
  const jobType = job.jobTypeName || job.jobType?.name || (typeof job.jobType === "string" ? null : null);
  const industry = job.industryName?.industryName || job.industryName?.name || (typeof job.industryName === "string" ? job.industryName : "Various Industries");
  
  // Clean up description and remove "What Clients Say" just in case it bled in from companies
  const description = (job.jobDescription || "")
    .replace(/<h2>What Clients Say<\/h2>/gi, '')
    .replace(/<p>What Clients Say<\/p>/gi, '')
    .replace(/What Clients Say/gi, '');
  
  const address = job.address || "";
  const zipCode = job.zipCode || "";
  const city = Array.isArray(job.city) 
    ? job.city.map((c: any) => Array.isArray(c) ? c.join(", ") : c?.name || c).join(", ") 
    : (job.city?.name || job.city || job.location || "Various Locations");
  
  const startDate = job.startDate ? new Date(job.startDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : "";
  const postedDate = job.createdAt ? new Date(job.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : "";

  let logoPath = "";
  if (job.companyLogo) {
    logoPath = typeof job.companyLogo === "object" ? job.companyLogo.filepath : job.companyLogo;
  } else if (job.company?.companyLogo && typeof job.company.companyLogo === "object") {
    logoPath = job.company.companyLogo.filepath;
  } else {
    logoPath = job.company?.companyLogo || job.company?.logo;
  }
  const logoUrl = logoPath ? `${IMAGE_BASE_URL}${logoPath}`.replace(/([^:]\/)\/+/g, "$1") : "/placeholder-logo.png";

  // Media Extractions
  const jobImagesList = Array.isArray(job.jobImages) ? job.jobImages.map((img: any) => img.filepath).filter(Boolean) : [];
  
  let companyImagesList: string[] = [];
  if (Array.isArray(job.companyImages)) {
    job.companyImages.flat(Infinity).forEach((item: any) => {
      if (item?.companyImages?.filepath) companyImagesList.push(item.companyImages.filepath);
      else if (item?.filepath) companyImagesList.push(item.filepath);
      else if (typeof item === 'string') companyImagesList.push(item);
    });
  }
  
  const allGalleryImages = [...jobImagesList, ...companyImagesList];
  const videoLinks = Array.isArray(job.videoLink) ? job.videoLink.filter(Boolean) : [];
  const attachments = Array.isArray(job.attachments) ? job.attachments.map((a: any) => a?.document).filter(Boolean) : [];

  const getYoutubeEmbedUrl = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? `https://www.youtube.com/embed/${match[2]}` : null;
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f5f7fa", pb: 10 }}>
      {/* Banner Section */}
      <Box 
        sx={{ 
          height: { xs: "120px", md: "160px" }, 
          background: "linear-gradient(135deg, #0096A4 0%, #005c66 100%)",
          position: "relative",
        }}
      >
        <Container maxWidth="lg" sx={{ height: "100%", position: "relative", zIndex: 1 }}>
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={() => router.push("/jobs")} 
            sx={{ 
              mt: 3, 
              color: "#fff", 
              backgroundColor: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(4px)",
              "&:hover": { backgroundColor: "rgba(255,255,255,0.2)" }
            }}
          >
            Back to Jobs
          </Button>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: { xs: -6, md: -8 }, position: "relative", zIndex: 2 }}>
        <Grid container spacing={4}>
          {/* Main Content Column */}
          <Grid item xs={12} md={8}>
            <Card sx={{ borderRadius: "16px", boxShadow: "0 10px 30px rgba(0,0,0,0.08)", mb: 4, overflow: "visible" }}>
              <CardContent sx={{ p: { xs: 3, md: 5 } }}>
                <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 3, alignItems: { xs: "center", sm: "flex-end" } }}>
                  <Box 
                    onClick={() => {
                      const id = job.companyId || job.company?._id || job.company?.id;
                      if (id) {
                        router.push(`/companies/${id}`);
                      }
                    }}
                    sx={{ 
                      width: 100, 
                      height: 100, 
                      backgroundColor: "#fff", 
                      borderRadius: "16px", 
                      boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      p: 1.5,
                      mt: { xs: -6, sm: -6 },
                      flexShrink: 0,
                      cursor: "pointer",
                      transition: "transform 0.2s ease",
                      "&:hover": { transform: "scale(1.05)" }
                    }}
                  >
                    <Box
                      component="img"
                      src={logoUrl}
                      alt={`${companyName} Logo`}
                      onError={(e: any) => { e.target.src = "/fevicon.png"; }}
                      sx={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", borderRadius: "8px" }}
                    />
                  </Box>
                  
                  <Box sx={{ flex: 1, textAlign: { xs: "center", sm: "left" }, pb: 1 }}>
                    {jobType && (
                      <Chip label={jobType} size="small" sx={{ backgroundColor: "#e6fffa", color: "#0096A4", fontWeight: 700, mb: 1.5, borderRadius: "6px" }} />
                    )}
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 800, color: "#1a202c", mb: 1 }}>
                      {jobTitle}
                    </Typography>
                    
                    <Typography 
                      variant="subtitle1" 
                      onClick={() => {
                        const id = job.companyId || job.company?._id || job.company?.id;
                        if (id) {
                          router.push(`/companies/${id}`);
                        }
                      }}
                      sx={{ 
                        color: "#0096A4", 
                        fontWeight: 600, 
                        display: "flex", 
                        alignItems: "center", 
                        gap: 1,
                        cursor: "pointer",
                        justifyContent: { xs: "center", sm: "flex-start" },
                        "&:hover": { textDecoration: "underline" }
                      }}
                    >
                      <BusinessIcon fontSize="small" /> {companyName}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mt: 4, pt: 3, borderTop: "1px solid #edf2f7" }}>
                  <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
                    <Box sx={{ p: 1, borderRadius: "8px", backgroundColor: "#f7fafc", color: "#4a5568", display: "flex" }}>
                      <LocationOnIcon fontSize="small" />
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: "#a0aec0", fontWeight: 600, display: "block" }}>Location</Typography>
                      <Typography variant="body2" sx={{ color: "#2d3748", fontWeight: 600 }}>{city}</Typography>
                    </Box>
                  </Box>
                  
                  {startDate && (
                    <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
                      <Box sx={{ p: 1, borderRadius: "8px", backgroundColor: "#f7fafc", color: "#4a5568", display: "flex" }}>
                        <CalendarMonthIcon fontSize="small" />
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ color: "#a0aec0", fontWeight: 600, display: "block" }}>Start Date</Typography>
                        <Typography variant="body2" sx={{ color: "#2d3748", fontWeight: 600 }}>{startDate}</Typography>
                      </Box>
                    </Box>
                  )}
                  
                  {job.salary && (
                    <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
                      <Box sx={{ p: 1, borderRadius: "8px", backgroundColor: "#f7fafc", color: "#4a5568", display: "flex" }}>
                        <AttachMoneyIcon fontSize="small" />
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ color: "#a0aec0", fontWeight: 600, display: "block" }}>Salary</Typography>
                        <Typography variant="body2" sx={{ color: "#2d3748", fontWeight: 600 }}>{job.salary}</Typography>
                      </Box>
                    </Box>
                  )}
                </Box>

                {/* Job Description */}
                {description && (
                  <Box sx={{ mt: 5 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: "#2d3748", mb: 2 }}>
                      Job Description
                    </Typography>
                    <Box 
                      className="job-description"
                      dangerouslySetInnerHTML={{ __html: description }}
                      sx={{
                        color: "#4a5568",
                        lineHeight: 1.8,
                        fontSize: "1.05rem",
                        "& p": { mb: 2 },
                        "& h2, & h3": { color: "#2d3748", mt: 4, mb: 2, fontWeight: 700, fontSize: "1.25rem" },
                        "& ul, & ol": { pl: 3, mb: 2 },
                        "& li": { mb: 1, position: "relative" }
                      }}
                    />
                  </Box>
                )}

                {/* Video Links */}
                {videoLinks.length > 0 && videoLinks.map((link: string, idx: number) => {
                  const embedUrl = getYoutubeEmbedUrl(link);
                  if (!embedUrl) return null;
                  return (
                    <Box sx={{ mt: 5 }} key={`video-${idx}`}>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: "#2d3748", mb: 2 }}>
                        Job Video
                      </Typography>
                      <Box sx={{ position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
                        <iframe 
                          src={embedUrl} 
                          title="Job Video" 
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                          allowFullScreen
                          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: 0 }}
                        />
                      </Box>
                    </Box>
                  );
                })}

                {/* Image Gallery */}
                {allGalleryImages.length > 0 && (
                  <Box sx={{ mt: 5 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: "#2d3748", mb: 2 }}>
                      Gallery
                    </Typography>
                    <Grid container spacing={2}>
                      {allGalleryImages.map((imgPath: string, idx: number) => (
                        <Grid item xs={12} sm={6} md={4} key={`img-${idx}`}>
                          <Box 
                            component="img"
                            src={`${IMAGE_BASE_URL}${imgPath}`.replace(/([^:]\/)\/+/g, "$1")}
                            alt={`Gallery image ${idx + 1}`}
                            sx={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}

              </CardContent>
            </Card>
          </Grid>

          {/* Sidebar Column */}
          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: "16px", boxShadow: "0 4px 15px rgba(0,0,0,0.05)", position: "sticky", top: "20px" }}>
              <CardContent sx={{ p: 4, display: "flex", flexDirection: "column", gap: 3 }}>
                
                <Box sx={{ p: 3, backgroundColor: "#f7fafc", borderRadius: "12px", border: "1px solid #edf2f7" }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#2d3748", mb: 2 }}>
                    Job Overview
                  </Typography>
                  
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography variant="body2" sx={{ color: "#718096" }}>Posted</Typography>
                      <Typography variant="body2" sx={{ color: "#2d3748", fontWeight: 600 }}>{postedDate}</Typography>
                    </Box>
                    {jobType && (
                      <>
                        <Divider sx={{ borderStyle: "dashed" }} />
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                          <Typography variant="body2" sx={{ color: "#718096" }}>Employment Type</Typography>
                          <Typography variant="body2" sx={{ color: "#2d3748", fontWeight: 600 }}>{jobType}</Typography>
                        </Box>
                      </>
                    )}
                    <Divider sx={{ borderStyle: "dashed" }} />
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography variant="body2" sx={{ color: "#718096" }}>Industry</Typography>
                      <Typography variant="body2" sx={{ color: "#2d3748", fontWeight: 600, textAlign: "right", maxWidth: "60%" }}>{industry}</Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Attachments */}
                {attachments.length > 0 && (
                  <Box sx={{ p: 3, backgroundColor: "#e2e8f0", borderRadius: "12px", border: "1px solid #cbd5e0" }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#2d3748", mb: 2 }}>
                      Attachments
                    </Typography>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                      {attachments.map((doc: any, idx: number) => (
                        <Button
                          key={`doc-${idx}`}
                          variant="outlined"
                          fullWidth
                          startIcon={<InsertDriveFileIcon />}
                          href={`${IMAGE_BASE_URL}${doc.filepath}`.replace(/([^:]\/)\/+/g, "$1")}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{ justifyContent: "flex-start", backgroundColor: "#fff", color: "#4a5568", borderColor: "#cbd5e0", textTransform: "none", textAlign: "left", "&:hover": { backgroundColor: "#f7fafc", borderColor: "#a0aec0" } }}
                        >
                          {doc.fileName || "Download Document"}
                        </Button>
                      ))}
                    </Box>
                  </Box>
                )}
                
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
