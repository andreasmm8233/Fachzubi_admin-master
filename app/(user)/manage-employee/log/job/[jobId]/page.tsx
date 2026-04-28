"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Box, Typography, CircularProgress, Grid, Paper, Stack, Chip, IconButton, Button, Avatar, Divider
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import WorkIcon from "@mui/icons-material/Work";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DescriptionIcon from "@mui/icons-material/Description";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import AttachFileIcon from "@mui/icons-material/AttachFile";

import Title from "@/app/components/title.components";
import { getJobDetailById } from "@/app/api/jobs/jobs";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const JobLogDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const jobId = params.jobId as string;
  
  const [loading, setLoading] = useState(true);
  const [job, setJob] = useState<any>(null);

  useEffect(() => {
    if (jobId) {
      fetchJobDetails();
    }
  }, [jobId]);

  const fetchJobDetails = async () => {
    setLoading(true);
    try {
      const res = await getJobDetailById(jobId);
      if (res.remote === "success") {
        setJob(res.data?.data || res.data || null);
      } else {
        toast.error("Failed to load job details.");
      }
    } catch (e) {
      toast.error("Error connecting to server.");
    }
    setLoading(false);
  };

  const getImageUrl = (imgObj: any) => {
    if (!imgObj) return "";
    let filename = "";
    if (typeof imgObj === "string") filename = imgObj;
    else if (imgObj.filepath) filename = imgObj.filepath;
    else if (imgObj.fileName) filename = imgObj.fileName;
    
    if (!filename) return "";
    if (filename.startsWith("http")) return filename;
    const baseUrl = process.env.NEXT_PUBLIC_IMAGE_URL || process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api/v1", "") || "";
    return `${baseUrl}/${filename}`;
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
        <CircularProgress sx={{ color: "#0096A4" }} />
      </Box>
    );
  }

  if (!job) {
    return (
      <Box sx={{ textAlign: "center", mt: 10, p: 4 }}>
        <WorkIcon sx={{ fontSize: 80, color: "#e0e0e0", mb: 2 }} />
        <Typography variant="h5" color="textSecondary" fontWeight="600">
          Job record not found!
        </Typography>
        <Button variant="outlined" onClick={() => window.close()} sx={{ mt: 3, color: "#0096A4", borderColor: "#0096A4" }}>
          Close Tab
        </Button>
      </Box>
    );
  }

  const industryName = typeof job.industryName === 'object' ? job.industryName?.industryName : job.industryName;
  const jobTypeName = job.jobTypeName || (typeof job.jobType === 'object' ? job.jobType?.jobTypeName : job.jobType);
  
  // Extract files gracefully
  const parsedJobImages = Array.isArray(job.jobImages) 
     ? job.jobImages.map((img: any) => typeof img === 'object' ? img.filepath : img).filter(Boolean)
     : [];
  
  // Format city array or string gracefully
  let citiesDisplay = "";
  if (Array.isArray(job.cityDetail)) {
    citiesDisplay = job.cityDetail.map((c: any) => typeof c === 'object' ? c.name : c).join(", ");
  } else if (Array.isArray(job.city)) {
    citiesDisplay = job.city.map((c: any) => typeof c === 'object' ? c.name : c).join(", ");
  } else if (typeof job.city === 'object') {
    citiesDisplay = job.city?.name || "";
  } else {
    citiesDisplay = job.city || "";
  }

  // Sanitize Video Links array
  const validVideos = Array.isArray(job.videoLink) 
      ? job.videoLink.filter((v: string) => typeof v === 'string' && v.trim().length > 0) 
      : [];

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: "#f8fafd", minHeight: "100vh" }}>
      <Stack direction={"row"} alignItems={"center"} spacing={2} sx={{ mb: 4 }}>
        <IconButton onClick={() => window.close()} sx={{ color: "#0096A4", bgcolor: "rgba(0,150,164,0.1)", '&:hover': { bgcolor: "rgba(0,150,164,0.2)" } }}>
          <ArrowBackIcon />
        </IconButton>
        <Title heading="Job Detailed Log" />
      </Stack>

      <Grid container spacing={4}>
        {/* Left Column - Main Content & Description */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: { xs: 3, md: 5 }, borderRadius: "16px", boxShadow: "0 12px 40px rgba(0,0,0,0.04)", border: "1px solid #f0f0f0" }}>
            <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }} mb={2} spacing={2}>
              <Typography variant="h3" fontWeight="800" sx={{ color: "#1a1a1a", fontSize: { xs: "2rem", md: "2.5rem" } }}>
                {job.jobTitle}
              </Typography>
              <Chip 
                  label={job.status ? "Active" : "Inactive"} 
                  sx={{ 
                    fontWeight: 700, px: 1, height: 32, fontSize: "0.9rem",
                    bgcolor: job.status ? "rgba(76, 175, 80, 0.15)" : "rgba(244, 67, 54, 0.15)", 
                    color: job.status ? "#2e7d32" : "#c62828" 
                  }} 
              />
            </Stack>

            <Stack direction="row" spacing={1.5} flexWrap="wrap" mb={4}>
              {jobTypeName && (
                <Chip icon={<WorkIcon fontSize="small"/>} label={jobTypeName} sx={{ bgcolor: "#f5f5f5", fontWeight: 600, mb: 1, color: "#333" }} />
              )}
              {industryName && (
                <Chip label={industryName} variant="outlined" sx={{ fontWeight: 600, borderColor: "#e0e0e0", mb: 1 }} />
              )}
            </Stack>

            <Divider sx={{ mb: 4 }} />

            {/* Description Render */}
            <Box>
              <Stack direction="row" alignItems="center" spacing={1.5} mb={2}>
                <DescriptionIcon sx={{ color: "#0096A4" }} />
                <Typography variant="h6" fontWeight="700" color="#333">Full Job Description</Typography>
              </Stack>
              
              <Box 
                 dangerouslySetInnerHTML={{ __html: job.jobDescription && job.jobDescription !== "<p><br></p>" ? job.jobDescription : "<p><i>No detailed description provided.</i></p>" }} 
                 sx={{ 
                   color: "#444", 
                   lineHeight: 1.8,
                   fontSize: "1.05rem",
                   '& h1, h2, h3': { color: "#222", mt: 3, mb: 2 },
                   '& p': { mb: 2, mt: 0 },
                   '& ul, ol': { pl: 3, mb: 2 },
                   '& li': { mb: 1 }
                 }} 
              />
            </Box>
            
            {/* Gallery Section */}
            {parsedJobImages.length > 0 && (
              <Box mt={6} pt={4} sx={{ borderTop: "1px dashed #eee" }}>
                <Typography variant="subtitle2" fontWeight="800" color="textSecondary" mb={3} letterSpacing={1}>
                  ATTACHED JOB IMAGES
                </Typography>
                <Stack direction="row" spacing={2} sx={{ overflowX: "auto", pb: 2, '&::-webkit-scrollbar': { height: 8 }, '&::-webkit-scrollbar-thumb': { bgcolor: '#ccc', borderRadius: 4 } }}>
                    {parsedJobImages.map((imgPath: string, i: number) => (
                       <Box 
                         key={i} 
                         component="img" 
                         src={getImageUrl(imgPath)} 
                         sx={{ width: 140, height: 140, borderRadius: "12px", objectFit: "cover", flexShrink: 0, border: "1px solid #eee", boxShadow: "0 4px 12px rgba(0,0,0,0.06)" }}
                         onError={(e: any) => { e.target.src = "https://via.placeholder.com/140?text=Image+Error"; }}
                       />
                    ))}
                </Stack>
              </Box>
            )}

          </Paper>
        </Grid>

        {/* Right Column - Meta & Assets */}
        <Grid item xs={12} lg={4}>
          <Stack spacing={4}>

            {/* Logistics & Contact */}
            <Paper sx={{ p: 0, borderRadius: "16px", boxShadow: "0 12px 40px rgba(0,0,0,0.04)", border: "1px solid #f0f0f0", overflow: "hidden" }}>
              <Box sx={{ p: 4, pb: 2, bgcolor: "#fafafa", borderBottom: "1px solid #f0f0f0" }}>
                <Typography variant="subtitle2" fontWeight="800" color="textSecondary" letterSpacing={1}>
                  ADDRESS & CONTACT DETAILS
                </Typography>
              </Box>
              
              <Stack spacing={0} sx={{ '& > *:not(:last-child)': { borderBottom: "1px solid #f5f5f5" }, px: 4, py: 2 }}>
                
                {(job.address || citiesDisplay || job.zipCode) && (
                  <Stack direction="row" spacing={2} alignItems="center" py={2}>
                    <Box sx={{ p: 1, bgcolor: "rgba(0,150,164,0.1)", borderRadius: "8px", color: "#0096A4", display: "flex" }}>
                      <LocationOnIcon fontSize="small" />
                    </Box>
                    <Box>
                      <Typography variant="caption" color="textSecondary" fontWeight="600" display="block" textTransform="uppercase">Location</Typography>
                      <Typography variant="body2" fontWeight="600" color="#333" mt={0.5}>
                        {[job.address, citiesDisplay].filter(Boolean).join(", ")}
                        {job.zipCode ? ` - ${job.zipCode}` : ""}
                      </Typography>
                    </Box>
                  </Stack>
                )}

                {job.email && (
                  <Stack direction="row" spacing={2} alignItems="center" py={2}>
                    <Box sx={{ p: 1, bgcolor: "rgba(0,150,164,0.1)", borderRadius: "8px", color: "#0096A4", display: "flex" }}>
                      <EmailIcon fontSize="small" />
                    </Box>
                    <Box>
                      <Typography variant="caption" color="textSecondary" fontWeight="600" display="block" textTransform="uppercase">Contact Email</Typography>
                      <Typography variant="body2" fontWeight="600" color="#333" mt={0.5}>{job.email}</Typography>
                    </Box>
                  </Stack>
                )}

                {job.startDate && (
                  <Stack direction="row" spacing={2} alignItems="center" py={2}>
                    <Box sx={{ p: 1, bgcolor: "rgba(0,150,164,0.1)", borderRadius: "8px", color: "#0096A4", display: "flex" }}>
                      <CalendarTodayIcon fontSize="small" />
                    </Box>
                    <Box>
                      <Typography variant="caption" color="textSecondary" fontWeight="600" display="block" textTransform="uppercase">Start Date</Typography>
                      <Typography variant="body2" fontWeight="600" color="#333" mt={0.5}>
                        {new Date(job.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </Typography>
                    </Box>
                  </Stack>
                )}

              </Stack>
            </Paper>
            
            {/* External Links & Media */}
            {(validVideos.length > 0 || (job.attachments && job.attachments.length > 0)) && (
              <Paper sx={{ p: 4, borderRadius: "16px", boxShadow: "0 12px 40px rgba(0,0,0,0.04)", border: "1px solid #f0f0f0" }}>
                <Typography variant="subtitle2" fontWeight="800" color="textSecondary" mb={3} letterSpacing={1}>
                  RESOURCES & MEDIA
                </Typography>
                
                <Stack spacing={4}>
                  {validVideos.length > 0 && (
                    <Box>
                      <Stack direction="row" alignItems="center" spacing={1.5} mb={2}>
                        <VideoLibraryIcon sx={{ color: "#0096A4" }} />
                        <Typography variant="body1" fontWeight="700" color="#333">Video Links</Typography>
                      </Stack>
                      <Stack spacing={1}>
                        {validVideos.map((vid: string, index: number) => (
                          <Button 
                            key={index} 
                            variant="outlined" 
                            href={vid.startsWith('http') ? vid : `https://${vid}`} 
                            target="_blank" 
                            rel="noreferrer" 
                            sx={{ alignSelf: "flex-start", color: "#0096A4", borderColor: "#0096A4", textTransform: "none", borderRadius: "8px" }}
                          >
                            Open External Video {validVideos.length > 1 ? index + 1 : ""}
                          </Button>
                        ))}
                      </Stack>
                    </Box>
                  )}

                  {job.attachments && job.attachments.length > 0 && (
                     <Box>
                       <Stack direction="row" alignItems="center" spacing={1.5} mb={2}>
                         <AttachFileIcon sx={{ color: "#0096A4" }} />
                         <Typography variant="body1" fontWeight="700" color="#333">Attachments</Typography>
                       </Stack>
                       <Stack spacing={1}>
                        {job.attachments.map((att: any, index: number) => {
                           const doc = att.document || att;
                           const attUrl = getImageUrl(doc);
                           const fileName = doc.fileName || `Attachment ${index + 1}`;
                           return attUrl ? (
                            <Button 
                              key={att._id || index} 
                              variant="text" 
                              href={attUrl} 
                              target="_blank" 
                              rel="noreferrer" 
                              sx={{ alignSelf: "flex-start", color: "#666", textTransform: "none", bgcolor: "#f5f5f5", px: 2, borderRadius: "8px", '&:hover':{ bgcolor: "#e0e0e0" } }} 
                              startIcon={<AttachFileIcon />}
                            >
                              {fileName}
                            </Button>
                           ) : null;
                        })}
                      </Stack>
                     </Box>
                  )}
                </Stack>
              </Paper>
            )}

          </Stack>
        </Grid>
      </Grid>
      
      <ToastContainer />
    </Box>
  );
};

export default JobLogDetailsPage;
