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
  IconButton,
  Link as MuiLink,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import WorkIcon from "@mui/icons-material/Work";
import LanguageIcon from "@mui/icons-material/Language";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import PersonIcon from "@mui/icons-material/Person";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { useRouter } from "next/navigation";
import { getPublicCompanyDetail } from "@/app/api/employer/employer";

const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_IMAGE_URL || "https://api.webzlab.site/";

export default function CompanyDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [company, setCompany] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCompanyDetail = async () => {
      try {
        const response = await getPublicCompanyDetail(params.id);
        if (response.remote === "success") {
          const data = response.data?.data || response.data;
          
          if (data?.employer || data?.company) {
            setCompany(data.employer || data.company);
            setJobs(data.jobs || data.activeJobs || []);
          } else {
            setCompany(data);
            setJobs(data.jobs || data.activeJobs || data.jobList || []);
          }
        } else {
          console.error("Failed to fetch company details", response.error);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyDetail();
  }, [params.id]);

  if (loading) {
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#f5f7fa" }}>
        <CircularProgress sx={{ color: "#0096A4" }} />
      </Box>
    );
  }

  if (!company) {
    return (
      <Box sx={{ minHeight: "100vh", textAlign: "center", pt: 10, backgroundColor: "#f5f7fa" }}>
        <Typography variant="h5" color="textSecondary">Company not found.</Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={() => router.push("/companies")} sx={{ mt: 3, color: "#0096A4" }}>
          Back to Companies
        </Button>
      </Box>
    );
  }

  const companyName = company.companyName || "Unknown Company";
  
  let logoPath = "";
  if (company.companyLogo && typeof company.companyLogo === "object") {
    logoPath = company.companyLogo.filepath;
  } else {
    logoPath = company.companyLogo;
  }
  const logoUrl = logoPath ? `${IMAGE_BASE_URL}${logoPath}`.replace(/([^:]\/)\/+/g, "$1") : "/placeholder-logo.png";
  
  const industry = company.industryName || "Various Industries";
  const address = company.address || "";
  
  // Clean up description and remove the "What Clients Say" section heading
  const description = (company.companyDescription || "")
    .replace(/<h2>What Clients Say<\/h2>/gi, '')
    .replace(/<p>What Clients Say<\/p>/gi, '')
    .replace(/What Clients Say/gi, '');
    
  const website = company.website || "";
  const email = company.email || "";
  const phoneNo = company.phoneNo || "";
  const contactPerson = company.contactPerson || "";
  const companyImages = Array.isArray(company.companyImages) ? company.companyImages.filter((img: string) => img) : [];
  const videoLinks = Array.isArray(company.videoLink) ? company.videoLink.filter((v: string) => v) : [];

  const getYoutubeEmbedUrl = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? `https://www.youtube.com/embed/${match[2]}` : null;
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f5f7fa", pb: 10 }}>
      {/* Sleek Gradient Banner */}
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
            onClick={() => router.push("/companies")} 
            sx={{ 
              mt: 3, 
              color: "#fff", 
              backgroundColor: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(4px)",
              "&:hover": { backgroundColor: "rgba(255,255,255,0.2)" }
            }}
          >
            Back to Companies
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
                    sx={{ 
                      width: 120, 
                      height: 120, 
                      backgroundColor: "#fff", 
                      borderRadius: "16px", 
                      boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      p: 1.5,
                      mt: { xs: -8, sm: -8 },
                      flexShrink: 0
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
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 800, color: "#1a202c", mb: 1 }}>
                      {companyName}
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, justifyContent: { xs: "center", sm: "flex-start" }, mb: 2 }}>
                      <Chip icon={<WorkIcon fontSize="small"/>} label={industry} size="small" sx={{ backgroundColor: "#e6fffa", color: "#0096A4", fontWeight: 600 }} />
                      {address && <Chip icon={<LocationOnIcon fontSize="small"/>} label={address} size="small" variant="outlined" sx={{ borderColor: "#e2e8f0" }} />}
                    </Box>
                  </Box>
                </Box>

                {/* Description */}
                {description && (
                  <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: "#2d3748", mb: 2 }}>
                      About Us
                    </Typography>
                    <Box 
                      className="company-description"
                      dangerouslySetInnerHTML={{ __html: description }}
                      sx={{
                        color: "#4a5568",
                        lineHeight: 1.7,
                        fontSize: "1rem",
                        "& p": { mb: 1.5 },
                        "& h2, & h3": { color: "#2d3748", mt: 3, mb: 1.5, fontWeight: 700, fontSize: "1.25rem" },
                        "& ul, & ol": { pl: 3, mb: 1.5 },
                        "& li": { mb: 0.5 }
                      }}
                    />
                  </Box>
                )}

                {/* Company Video */}
                {videoLinks.length > 0 && videoLinks.map((link: string, idx: number) => {
                  const embedUrl = getYoutubeEmbedUrl(link);
                  if (!embedUrl) return null;
                  return (
                    <Box sx={{ mt: 4 }} key={idx}>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: "#2d3748", mb: 2 }}>
                        Company Video
                      </Typography>
                      <Box sx={{ position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
                        <iframe 
                          src={embedUrl} 
                          title="Company Video" 
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                          allowFullScreen
                          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: 0 }}
                        />
                      </Box>
                    </Box>
                  );
                })}

                {/* Company Images Gallery */}
                {companyImages.length > 0 && (
                  <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: "#2d3748", mb: 2 }}>
                      Gallery
                    </Typography>
                    <Grid container spacing={2}>
                      {companyImages.map((img: string, idx: number) => (
                        <Grid item xs={6} sm={4} key={idx}>
                          <Box 
                            sx={{
                              width: "100%",
                              paddingTop: "75%", // 4:3 aspect ratio
                              position: "relative",
                              borderRadius: "12px",
                              overflow: "hidden",
                              boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                            }}
                          >
                            <Box
                              component="img"
                              src={`${IMAGE_BASE_URL}${img}`.replace(/([^:]\/)\/+/g, "$1")}
                              onError={(e: any) => { e.target.style.display = 'none'; }}
                              sx={{
                                position: "absolute",
                                top: 0, left: 0, width: "100%", height: "100%",
                                objectFit: "cover",
                                transition: "transform 0.3s ease",
                                "&:hover": { transform: "scale(1.05)" }
                              }}
                            />
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}
              </CardContent>
            </Card>

            {/* Active Jobs */}
            <Typography variant="h5" component="h2" sx={{ fontWeight: 800, color: "#1a202c", mb: 3, mt: 5 }}>
              Open Positions
            </Typography>

            {jobs.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 8, backgroundColor: "#fff", borderRadius: "16px", border: "1px dashed #cbd5e0" }}>
                <Typography variant="h6" sx={{ color: "#718096" }}>No open positions at the moment.</Typography>
              </Box>
            ) : (
              <Grid container spacing={3}>
                {jobs.map((job, index) => {
                  const jobTitle = job.jobTitle || "Position Available";
                  const jobType = job.jobType || "Full-time";
                  const jobCity = Array.isArray(job.city) ? job.city.join(', ') : (job.city || "Various Locations");
                  const startDate = job.startDate ? new Date(job.startDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : "";
                  
                  return (
                    <Grid item xs={12} key={job._id || index}>
                      <Card 
                        onClick={() => {
                          const id = job._id || job.id;
                          if (id) {
                            router.push(`/jobs/${id}`);
                          }
                        }}
                        sx={{ 
                          borderRadius: "12px", 
                          boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
                          transition: "all 0.2s ease",
                          border: "1px solid transparent",
                          cursor: "pointer",
                          "&:hover": { 
                            transform: "translateY(-2px)", 
                            boxShadow: "0 8px 20px rgba(0,96,164,0.12)",
                            borderColor: "rgba(0,150,164,0.3)"
                          }
                        }}
                      >
                        <CardContent sx={{ p: 3, display: "flex", flexDirection: { xs: "column", sm: "row" }, justifyContent: "space-between", alignItems: { xs: "flex-start", sm: "center" }, gap: 2 }}>
                          <Box>
                            <Typography variant="h5" sx={{ fontWeight: 700, color: "#1a202c", mb: 1 }}>
                              {jobTitle}
                            </Typography>
                            
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center" }}>
                              <Typography variant="body2" sx={{ color: "#718096", display: "flex", alignItems: "center", gap: 0.5 }}>
                                <LocationOnIcon fontSize="small" sx={{ color: "#a0aec0" }} /> {jobCity}
                              </Typography>
                              {startDate && (
                                <Typography variant="body2" sx={{ color: "#718096", display: "flex", alignItems: "center", gap: 0.5 }}>
                                  <CalendarMonthIcon fontSize="small" sx={{ color: "#a0aec0" }} /> Start: {startDate}
                                </Typography>
                              )}
                            </Box>
                          </Box>

                          <Box sx={{ display: "flex", flexDirection: "column", alignItems: { xs: "flex-start", sm: "flex-end" }, gap: 1 }}>
                            <Chip label={jobType} size="medium" sx={{ backgroundColor: "#edf2f7", color: "#4a5568", fontWeight: 600, borderRadius: "8px" }} />
                            <Button 
                              variant="contained" 
                              size="small" 
                              onClick={(e) => {
                                e.stopPropagation();
                                const id = job._id || job.id;
                                if (id) {
                                  router.push(`/jobs/${id}`);
                                }
                              }}
                              sx={{ backgroundColor: "#0096A4", "&:hover": { backgroundColor: "#007a86" }, borderRadius: "8px", textTransform: "none", fontWeight: 600, px: 3 }}
                            >
                              View Details
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            )}
          </Grid>

          {/* Sidebar Column */}
          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: "16px", boxShadow: "0 4px 15px rgba(0,0,0,0.05)", position: "sticky", top: "20px" }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: "#1a202c", mb: 3, borderBottom: "1px solid #edf2f7", pb: 1.5 }}>
                  Contact Information
                </Typography>
                
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  {contactPerson && (
                    <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                      <Box sx={{ p: 1, borderRadius: "8px", backgroundColor: "#e6fffa", color: "#0096A4", display: "flex" }}>
                        <PersonIcon />
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ color: "#a0aec0", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>Contact Person</Typography>
                        <Typography variant="body1" sx={{ color: "#2d3748", fontWeight: 600 }}>{contactPerson}</Typography>
                      </Box>
                    </Box>
                  )}

                  {email && (
                    <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                      <Box sx={{ p: 1, borderRadius: "8px", backgroundColor: "#e6fffa", color: "#0096A4", display: "flex" }}>
                        <EmailIcon />
                      </Box>
                      <Box sx={{ overflow: "hidden" }}>
                        <Typography variant="caption" sx={{ color: "#a0aec0", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>Email</Typography>
                        <MuiLink href={`mailto:${email}`} underline="hover" sx={{ display: "block", color: "#2d3748", fontWeight: 600, wordBreak: "break-all" }}>
                          {email}
                        </MuiLink>
                      </Box>
                    </Box>
                  )}

                  {phoneNo && (
                    <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                      <Box sx={{ p: 1, borderRadius: "8px", backgroundColor: "#e6fffa", color: "#0096A4", display: "flex" }}>
                        <PhoneIcon />
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ color: "#a0aec0", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>Phone</Typography>
                        <MuiLink href={`tel:${phoneNo}`} underline="hover" sx={{ display: "block", color: "#2d3748", fontWeight: 600 }}>
                          {phoneNo}
                        </MuiLink>
                      </Box>
                    </Box>
                  )}

                  {website && (
                    <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                      <Box sx={{ p: 1, borderRadius: "8px", backgroundColor: "#e6fffa", color: "#0096A4", display: "flex" }}>
                        <LanguageIcon />
                      </Box>
                      <Box sx={{ overflow: "hidden" }}>
                        <Typography variant="caption" sx={{ color: "#a0aec0", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>Website</Typography>
                        <MuiLink href={website.startsWith('http') ? website : `https://${website}`} target="_blank" rel="noopener noreferrer" underline="hover" sx={{ display: "block", color: "#2d3748", fontWeight: 600, wordBreak: "break-all" }}>
                          {website}
                        </MuiLink>
                      </Box>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
