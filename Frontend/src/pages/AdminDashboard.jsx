import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import {
  Box, Grid, TextField, Card, CardContent, Typography, Table, TableHead,
  TableRow, TableCell, TableBody, Chip, Divider, Stack, Avatar,CircularProgress
} from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import Tooltip from '@mui/material/Tooltip';
import './App.css'



const statusColor = {
  Applied: 'info',
  Offer: 'warning',
  Hired: 'success',
};


const CompanyWiseBreakdown = () => {
  const [apps, setApps] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true); // loader state
  

  useEffect(() => {
    const fetchApps = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const res = await axios.get('/applications/getApplications', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLoading(false);
        setApps(res.data);
      } catch (err) {
        console.error('Error fetching applications:', err);
      }
    };

    fetchApps();
  }, []);

  // Group by company
  const companyGroups = apps.reduce((acc, app) => {
    const company = app.company || 'Unknown';
    if (!acc[company]) acc[company] = [];
    acc[company].push(app);
    return acc;
  }, {});

  // Count status
  const getStatusCounts = (companyApps) => {
    return {
      Applied: companyApps.filter(app => !['Offer', 'Hired'].includes(app.status)).length,
      Offer: companyApps.filter(app => app.status === 'Offer').length,
      Hired: companyApps.filter(app => app.status === 'Hired').length,
    };
  };

 return (
  <Box sx={{ px: 4, py: 5 }}>
    <Typography variant="h4" fontWeight="bold" gutterBottom>
      🏢 Company-wise Job Application Dashboard
    </Typography>

    <Box mb={3} mt={1} display="flex" justifyContent="flex-end">
      <TextField
        label="Search Company"
        variant="outlined"
        size="small"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ width: 250 }}
      />
    </Box>

    {loading ? (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <CircularProgress />
      </Box>
    ) : (
      <Grid container spacing={2}>
        {Object.entries(companyGroups)
          .filter(([company]) =>
            company.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map(([company, apps]) => {
            const counts = getStatusCounts(apps);
            return (
              <Grid item key={company} style={{ width: "32.5%" }} className="cardwidth">
                <Card
                  sx={{
                    borderRadius: 3,
                    boxShadow: 4,
                    height: 400,
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <CardContent
                    sx={{
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                      overflow: "hidden",
                    }}
                  >
                    <Box display="flex" alignItems="center" mb={2}>
                      <Avatar sx={{ bgcolor: "#1976d2", mr: 2 }}>
                        <BusinessIcon />
                      </Avatar>
                      <Typography variant="h6" fontWeight="bold">
                        {company}
                      </Typography>
                    </Box>

                    <Stack direction="row" spacing={2} mb={2}>
                      <Chip label={`Applied: ${counts.Applied}`} color="info" variant="outlined" />
                      <Chip label={`Offer: ${counts.Offer}`} color="warning" variant="outlined" />
                      <Chip label={`Hired: ${counts.Hired}`} color="success" variant="outlined" />
                    </Stack>

                    <Divider sx={{ mb: 1 }} />

                    <Box sx={{ flexGrow: 1, overflowY: "auto", maxHeight: 220 }}>
                      <Table size="small" stickyHeader>
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ maxWidth: 100 }}>Name</TableCell>
                            <TableCell sx={{ maxWidth: 80 }}>Status</TableCell>
                            <TableCell sx={{ maxWidth: 120 }}>Title</TableCell>
                            <TableCell sx={{ maxWidth: 160 }}>Email</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {apps.map((app) => (
                            <TableRow key={app.id}>
                              <TableCell sx={{ maxWidth: 100 }}>
                                <Tooltip title={app.userName || "N/A"} arrow>
                                  <Typography variant="body2" noWrap>
                                    {app.userName || "N/A"}
                                  </Typography>
                                </Tooltip>
                              </TableCell>
                              <TableCell sx={{ maxWidth: 80 }}>
                                <Tooltip title={app.status || "N/A"} arrow>
                                  <Chip
                                    label={app.status}
                                    color={statusColor[app.status] || "default"}
                                    size="small"
                                  />
                                </Tooltip>
                              </TableCell>
                              <TableCell sx={{ maxWidth: 120 }}>
                                <Tooltip title={app.title || "N/A"} arrow>
                                  <Typography variant="body2" noWrap>
                                    {app.title || "N/A"}
                                  </Typography>
                                </Tooltip>
                              </TableCell>
                              <TableCell sx={{ maxWidth: 160 }}>
                                <Tooltip title={app.userEmail || "N/A"} arrow>
                                  <Typography variant="body2" noWrap>
                                    {app.userEmail || "N/A"}
                                  </Typography>
                                </Tooltip>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
      </Grid>
    )}
  </Box>
);

  
};

export default CompanyWiseBreakdown;
