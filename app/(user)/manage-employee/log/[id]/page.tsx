"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Box, Typography, CircularProgress, Accordion, AccordionSummary, AccordionDetails,
  Grid, Card, CardContent, Stack, Chip, Button, IconButton, Divider, Avatar, Paper
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import BusinessIcon from "@mui/icons-material/Business";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import WorkIcon from "@mui/icons-material/Work";
import LanguageIcon from "@mui/icons-material/Language";
import PersonIcon from "@mui/icons-material/Person";

import Title from "@/app/components/title.components";
import { getEmployeeEmployers, getEmployeeEmployerJobs } from "@/app/api/manageEmployee/employee";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EmployeeLogPage = () => {
  const params = useParams();
  const router = useRouter();
  const employeeId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [companies, setCompanies] = useState<any[]>([]);
  const [jobsData, setJobsData] = useState<{ [key: string]: { loading: boolean, jobs: any[] } }>({});

  useEffect(() => {
    if (employeeId) {
      fetchCompanies();
    }
  }, [employeeId]);

  // Pre-fetch jobs for all companies so their counts are accurate immediately
  useEffect(() => {
    if (companies && companies.length > 0) {
      companies.forEach((company) => {
        if (company._id && !jobsData[company._id]) {
          fetchJobs(company._id);
        }
      });
    }
  }, [companies]);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const res = await getEmployeeEmployers(employeeId);
      if (res.remote === "success") {
        setCompanies(res.data?.data || res.data || []);
      } else {
        toast.error("Failed to load employers. Please try again.");
      }
    } catch (e) {
      toast.error("Error connecting to server.");
    }
    setLoading(false);
  };

  const handleAccordionChange = (companyId: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    if (isExpanded && !jobsData[companyId]) {
      fetchJobs(companyId);
    }
  };

  const fetchJobs = async (companyId: string) => {
    setJobsData(prev => ({ ...prev, [companyId]: { loading: true, jobs: [] } }));
    try {
      const res = await getEmployeeEmployerJobs(employeeId, companyId);
      if (res.remote === "success") {
        setJobsData(prev => ({ ...prev, [companyId]: { loading: false, jobs: res.data?.data || res.data || [] } }));
      } else {
        toast.error("Failed to load jobs for company.");
        setJobsData(prev => ({ ...prev, [companyId]: { loading: false, jobs: [] } }));
      }
    } catch (err) {
      setJobsData(prev => ({ ...prev, [companyId]: { loading: false, jobs: [] } }));
    }
  };

  const getImageUrl = (filename: string) => {
    if (!filename) return "";
    if (filename.startsWith("http")) return filename;
    // Fallback standard structure if NEXT_PUBLIC_IMAGE_URL exists or relative
    const baseUrl = process.env.NEXT_PUBLIC_IMAGE_URL || process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api/v1", "") || "";
    return `${baseUrl}/${filename}`;
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
        <CircularProgress sx={{ color: "#0096A4" }} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: "#f8fafd", minHeight: "100vh" }}>
      <Stack direction={"row"} alignItems={"center"} spacing={2} sx={{ mb: 4 }}>
        <IconButton onClick={() => window.close()} sx={{ color: "#0096A4", bgcolor: "rgba(0,150,164,0.1)", '&:hover': { bgcolor: "rgba(0,150,164,0.2)" } }}>
          <ArrowBackIcon />
        </IconButton>
        <Title heading="Employee Action Log" />
      </Stack>

      <Typography variant="h6" sx={{ color: "#646464", mb: 4, fontWeight: 600 }}>
        Total Employers Managed: <span style={{ color: "#0096A4" }}>{companies.length}</span>
      </Typography>

      {companies.length === 0 ? (
        <Box sx={{ textAlign: "center", mt: 10, bgcolor: "#fff", p: 5, borderRadius: 4, boxShadow: "0 10px 30px rgba(0,0,0,0.02)" }}>
          <BusinessIcon sx={{ fontSize: 80, color: "#e0e0e0" }} />
          <Typography variant="h5" color="textSecondary" sx={{ mt: 2, fontWeight: 600 }}>
            No robust employer profiles found.
          </Typography>
        </Box>
      ) : (
        companies.map((company, index) => {
          const industryName = typeof company.industryName === 'object' ? company.industryName?.industryName : company.industryName;
          const cityName = typeof company.city === 'object' ? company.city?.name : company.city;

          return (
          <Paper 
            key={company._id || index} 
            sx={{ 
              mb: 5, 
              borderRadius: "16px", 
              boxShadow: "0 12px 40px rgba(0,0,0,0.06)",
              overflow: "hidden",
              border: "1px solid rgba(0,0,0,0.03)"
            }}
          >
            {/* Top Banner / Header area */}
            <Box sx={{ p: 4, bgcolor: "#fff", borderBottom: "1px solid #f0f0f0" }}>
              <Grid container spacing={4}>
                <Grid item xs={12} md={8}>
                  <Stack direction="row" spacing={3} alignItems="flex-start">
                    {company.companyLogo ? (
                      <Box 
                        component="img" 
                        src={getImageUrl(company.companyLogo)} 
                        sx={{ width: 100, height: 100, borderRadius: "12px", objectFit: "cover", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                        onError={(e: any) => { e.target.src = "https://via.placeholder.com/100?text=Logo"; }}
                      />
                    ) : (
                      <Avatar sx={{ width: 100, height: 100, borderRadius: "12px", bgcolor: "rgba(0,150,164,0.1)", color: "#0096A4" }}>
                        <BusinessIcon sx={{ fontSize: 40 }} />
                      </Avatar>
                    )}
                    
                    <Box>
                      <Stack direction="row" alignItems="center" spacing={2} mb={1}>
                        <Typography variant="h4" fontWeight="800" sx={{ color: "#1a1a1a" }}>
                          {company.companyName || "N/A"}
                        </Typography>
                        <Chip 
                           label={company.status ? "Active" : "Inactive"} 
                           size="small"
                           sx={{ 
                             fontWeight: 600, 
                             bgcolor: company.status ? "rgba(76, 175, 80, 0.15)" : "rgba(244, 67, 54, 0.15)", 
                             color: company.status ? "#2e7d32" : "#c62828" 
                           }} 
                        />
                      </Stack>
                      
                      <Stack direction="row" spacing={1} mb={2} flexWrap="wrap">
                        {industryName && (
                          <Chip icon={<WorkIcon fontSize="small"/>} label={industryName} size="small" sx={{ bgcolor: "#f5f5f5", fontWeight: 500, mb: 1 }} />
                        )}
                        {company.jobTitle && (
                          <Chip label={company.jobTitle} size="small" variant="outlined" sx={{ fontWeight: 500, mb: 1 }} />
                        )}
                      </Stack>
                      
                      <Grid container spacing={2}>
                         <Grid item xs={12} sm={6}>
                            <Stack spacing={1.5}>
                              {company.contactPerson && (
                                <Stack direction="row" spacing={1} alignItems="center" color="textSecondary">
                                  <PersonIcon fontSize="small" sx={{ color: "#0096A4" }} />
                                  <Typography variant="body2">{company.contactPerson}</Typography>
                                </Stack>
                              )}
                              {company.email && (
                                <Stack direction="row" spacing={1} alignItems="center" color="textSecondary">
                                  <EmailIcon fontSize="small" sx={{ color: "#0096A4" }} />
                                  <Typography variant="body2">{company.email}</Typography>
                                </Stack>
                              )}
                              {company.phoneNo && (
                                <Stack direction="row" spacing={1} alignItems="center" color="textSecondary">
                                  <PhoneIcon fontSize="small" sx={{ color: "#0096A4" }} />
                                  <Typography variant="body2">{company.phoneNo}</Typography>
                                </Stack>
                              )}
                            </Stack>
                         </Grid>
                         <Grid item xs={12} sm={6}>
                            <Stack spacing={1.5}>
                              {company.website && (
                                <Stack direction="row" spacing={1} alignItems="center" color="textSecondary">
                                  <LanguageIcon fontSize="small" sx={{ color: "#0096A4" }} />
                                  <Typography variant="body2" component="a" href={'https://' + company.website.replace('https://', '')} target="_blank" sx={{ color: "#0096A4", textDecoration: "none", '&:hover': { textDecoration: 'underline' } }}>
                                    {company.website}
                                  </Typography>
                                </Stack>
                              )}
                              {(company.address || cityName) && (
                                <Stack direction="row" spacing={1} alignItems="flex-start" color="textSecondary">
                                  <LocationOnIcon fontSize="small" sx={{ color: "#0096A4", mt: 0.3 }} />
                                  <Typography variant="body2" sx={{ lineHeight: 1.4 }}>
                                    {company.address} {company.address && cityName && <br/>}
                                    {cityName} {company.zipCode && `- ${company.zipCode}`}
                                  </Typography>
                                </Stack>
                              )}
                            </Stack>
                         </Grid>
                      </Grid>
                    </Box>
                  </Stack>
                </Grid>
                
                {/* Images Preview Section */}
                <Grid item xs={12} md={4} sx={{ borderLeft: { md: "1px dashed #e0e0e0" }, pl: { md: 4 } }}>
                   <Typography variant="subtitle2" fontWeight="700" color="textSecondary" mb={2}>GALLERY PREVIEW</Typography>
                   {company.companyImages && company.companyImages.length > 0 ? (
                      <Stack direction="row" spacing={1.5} sx={{ overflowX: "auto", pb: 1, '&::-webkit-scrollbar': { height: 6 }, '&::-webkit-scrollbar-thumb': { bgcolor: '#ccc', borderRadius: 3 } }}>
                        {company.companyImages.map((imgPath: string, i: number) => (
                           <Box 
                             key={i} 
                             component="img" 
                             src={getImageUrl(imgPath)} 
                             sx={{ width: 80, height: 80, borderRadius: "8px", objectFit: "cover", flexShrink: 0, border: "1px solid #eee", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
                             onError={(e: any) => { e.target.style.display = 'none'; }}
                           />
                        ))}
                      </Stack>
                   ) : (
                      <Typography variant="body2" color="textSecondary" fontStyle="italic">No gallery images uploaded.</Typography>
                   )}
                </Grid>
              </Grid>
            </Box>

            {/* Description Section */}
            {company.companyDescription && (
              <Box sx={{ p: 4, bgcolor: "#fafafa" }}>
                <Typography variant="subtitle2" fontWeight="700" color="textSecondary" mb={2}>ABOUT THE COMPANY</Typography>
                <Box 
                   dangerouslySetInnerHTML={{ __html: company.companyDescription }} 
                   sx={{ 
                     color: "#444", 
                     lineHeight: 1.8,
                     '& h2': { fontSize: '1.25rem', fontWeight: 600, mt: 0, color: "#222" },
                     '& p': { mb: 1.5, mt: 0 },
                   }} 
                />
              </Box>
            )}

            {/* Jobs Accordion */}
            <Accordion 
              onChange={handleAccordionChange(company._id)}
              sx={{ 
                boxShadow: "none", 
                borderTop: "1px solid #eee",
                "&:before": { display: "none" }
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: "#0096A4", fontSize: 28 }} />}
                sx={{ bgcolor: "#fff", py: 1.5, '&:hover': { bgcolor: "rgba(0,150,164,0.02)" } }}
              >
                <Stack direction="row" alignItems="center" spacing={2}>
                  <WorkIcon sx={{ color: "#0096A4" }} />
                  <Typography variant="subtitle1" fontWeight="700" sx={{ color: "#333" }}>
                    View Posted Jobs ({jobsData[company._id]?.jobs?.length || 0})
                  </Typography>
                </Stack>
              </AccordionSummary>
              
              <AccordionDetails sx={{ bgcolor: "#f8fafd", p: 4, borderTop: "1px solid #eee" }}>
                {jobsData[company._id]?.loading ? (
                   <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                     <CircularProgress size={32} sx={{ color: "#0096A4" }} />
                   </Box>
                ) : jobsData[company._id]?.jobs?.length > 0 ? (
                  <Grid container spacing={3}>
                    {jobsData[company._id].jobs.map((job) => (
                      <Grid item xs={12} md={6} xl={4} key={job._id}>
                        <Card 
                          onClick={() => window.open(`/manage-employee/log/job/${job._id}`, '_blank')}
                          sx={{ 
                            height: "100%", 
                            cursor: "pointer",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.03)", 
                            border: "1px solid #eaeaea", 
                            borderRadius: "12px", 
                            transition: "transform 0.2s", 
                            '&:hover': { transform: 'translateY(-4px)', boxShadow: "0 10px 20px rgba(0,150,164,0.08)", borderColor: "rgba(0,150,164,0.3)" } 
                          }}
                        >
                          <CardContent sx={{ p: 3 }}>
                            <Stack direction="row" alignItems="flex-start" justifyContent="space-between" mb={1.5}>
                              <Typography variant="h6" fontSize="1.15rem" fontWeight="700" color="#222">
                                {job.jobTitle}
                              </Typography>
                              <Chip 
                                 size="small" 
                                 label={job.status ? "Active" : "Inactive"} 
                                 sx={{ 
                                   bgcolor: job.status ? "rgba(76, 175, 80, 0.1)" : "rgba(244, 67, 54, 0.1)", 
                                   color: job.status ? "#4caf50" : "#f44336",
                                   fontWeight: 700 
                                 }} 
                              />
                            </Stack>
                            
                            <Stack direction="row" alignItems="center" spacing={1} color="textSecondary" mb={2}>
                              <WorkIcon fontSize="small" sx={{ opacity: 0.6 }} />
                              <Typography variant="body2" fontWeight="500">{job.jobType?.jobTypeName || "Not specified"}</Typography>
                            </Stack>
                            
                            <Divider sx={{ my: 2, borderColor: "#f0f0f0" }} />
                            
                            <Stack spacing={1.5}>
                              <Box>
                                <Typography variant="caption" display="block" color="textSecondary" fontWeight={600} textTransform="uppercase">Contact Email</Typography>
                                <Typography variant="body2" fontWeight={500} color="#333">{job.email}</Typography>
                              </Box>
                              <Box>
                                <Typography variant="caption" display="block" color="textSecondary" fontWeight={600} textTransform="uppercase">Created On</Typography>
                                <Typography variant="body2" fontWeight={500} color="#333">{new Date(job.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</Typography>
                              </Box>
                            </Stack>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Box textAlign="center" py={4}>
                    <Typography variant="subtitle1" color="textSecondary" fontWeight="500">
                      This employer has not posted any jobs yet.
                    </Typography>
                  </Box>
                )}
              </AccordionDetails>
            </Accordion>
          </Paper>
        )})
      )}
      
      <ToastContainer />
    </Box>
  );
};

export default EmployeeLogPage;
