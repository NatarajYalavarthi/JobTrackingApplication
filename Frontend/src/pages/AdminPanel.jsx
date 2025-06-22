import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import {
  Typography, Box, TextField, Button, Grid, Card, CardContent, Chip,
  MenuItem, Select, InputLabel, FormControl, CircularProgress, Divider
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import FeedbackIcon from '@mui/icons-material/Feedback';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



// Same imports as yours...

function AdminPanel() {
  const [applications, setApplications] = useState([]);
  const [feedbacks, setFeedbacks] = useState({});
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [loadingStatusId, setLoadingStatusId] = useState(null);
  const [loadingFeedbackId, setLoadingFeedbackId] = useState(null);
  const [companySearch, setCompanySearch] = useState('');

  const role = localStorage.getItem('userRole');
  const isAdmin = role === 'admin';

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/applications/getApplications', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setApplications(data);
      const fb = {};
      data.forEach((app) => {
        fb[app.id] = app.feedback || '';
      });
      setFeedbacks(fb);
    } catch (err) {
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFeedbackChange = (id, value) => {
    setFeedbacks(prev => ({ ...prev, [id]: value }));
  };
const submitFeedback = async (id) => {
  if (!feedbacks[id]?.trim()) return alert('Feedback is required!');
  try {
    setLoadingFeedbackId(id);
    await axios.post(`/feedback/${id}`, {
      comments: feedbacks[id],
      applicationId: id,
    }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });

    await fetchApplications(); // Wait until fetch completes
    toast.success('Feedback submitted successfully!');
  } catch (err) {
    toast.error('Failed to submit feedback');
  } finally {
    setLoadingFeedbackId(null);
  }
};


const updateStatus = async (id, newStatus) => {
  setLoadingStatusId(id);
  try {
    await axios.put(`/applications/${id}`, { status: newStatus }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });

    await fetchApplications(); // Wait until fetch completes
    toast.success('Status updated successfully!');
  } catch (err) {
    toast.error('Error updating status');
  } finally {
    setLoadingStatusId(null);
  }
};

  const handleDownloadResume = (base64String, fileName = 'resume.pdf') => {
    const link = document.createElement('a');
    link.href = base64String;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

const filteredApps = applications
  .filter(app => {
    const matchStatus = statusFilter === 'All' || app.status === statusFilter;
    const matchCompany = app.company.toLowerCase().includes(companySearch.toLowerCase());
    return matchStatus && matchCompany;
  })
  .sort((a, b) => new Date(b.applied_date) - new Date(a.applied_date));



  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
        <CircularProgress size={40} />
      </Box>
    );
  }

  return (
    <>
  

    <Box sx={{ px: 4, py: 5 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={5}>

        <Typography variant="h4" fontWeight="bold">
          <AdminPanelSettingsIcon sx={{fontSize:"40px", mr: 1, color: '#1976d2' }} />
          {isAdmin ? 'Admin Dashboard' : 'Applicant Dashboard'}
        </Typography>
        <TextField
    label="Search by Company"
    variant="outlined"
    size="small"
    value={companySearch}
    onChange={(e) => setCompanySearch(e.target.value)}
    sx={{ minWidth: 200 }}
  />
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Status Filter</InputLabel>
          <Select
            label="Status Filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="All">All Statuses</MenuItem>
            <MenuItem value="Applied">Applied</MenuItem>
            <MenuItem value="Interviewing">Interviewing</MenuItem>
            <MenuItem value="Offer">Offer</MenuItem>
            <MenuItem value="Rejected">Rejected</MenuItem>
            <MenuItem value="Hired">Hired</MenuItem>
          </Select>
        </FormControl>
      </Box>
 <ToastContainer
  position="top-right"
  autoClose={3000}
  hideProgressBar={false}
  newestOnTop
  closeOnClick
  rtl={false}
  pauseOnFocusLoss
  draggable
  pauseOnHover
  style={{ zIndex: 9999 }}
/>
      <Grid container spacing={4}>
        {filteredApps.map((app) => (
          <Grid item xs={12} sm={6} md={4} key={app.id}>
            <Card
              sx={{
                borderRadius: 4,
                boxShadow: 6,
                p: 2,
                transition: '0.3s ease',
                '&:hover': {
                  boxShadow: 10,
                  transform: 'translateY(-4px)',
                },
              }}
            >
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">{app.title}</Typography>
                    <Typography variant="body2" color="text.secondary">{app.company}</Typography>
                  </Box>
                  <Chip label={app.status} color={getStatusColor(app.status)} />
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box mb={1}>
                  <Typography variant="body2"><strong>Name:</strong> {app.userName}</Typography>
                  <Typography variant="body2"><strong>Email:</strong> {app.userEmail}</Typography>
                  <Typography variant="body2">
                    <strong>Date:</strong> {new Date(app.applied_date).toLocaleDateString()}
                  </Typography>
                </Box>

                <Box mt={2} display="flex" gap={1} flexWrap="wrap">
                  <Button
                    startIcon={<DownloadIcon />}
                    variant="outlined"
                    size="small"
                    onClick={() => handleDownloadResume(app.resume, `${app.userName}_resume.pdf`)}
                  >
                    Resume
                  </Button>

                <FormControl size="small" sx={{ minWidth: 120 }}>
  {loadingStatusId === app.id ? (
    <CircularProgress size={20} />
  ) : (
    <Select
      value={app.status}
      onChange={(e) => updateStatus(app.id, e.target.value)}
    >
      {['Applied', 'Interviewing', 'Offer', 'Rejected', 'Hired'].map(status => (
        <MenuItem key={status} value={status}>{status}</MenuItem>
      ))}
    </Select>
  )}
</FormControl>

                </Box>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle2" mb={1}>
                  <FeedbackIcon sx={{ fontSize: 18, mr: 1 }} />
                  Feedback
                </Typography>
                <TextField
                  multiline
                  rows={3}
                  fullWidth
                  placeholder="Enter feedback"
                  value={feedbacks[app.id] || ''}
                  onChange={(e) => handleFeedbackChange(app.id, e.target.value)}
                  sx={{ mb: 1 }}
                />
               <Button
  variant="contained"
  fullWidth
  disabled={loadingFeedbackId === app.id}
  onClick={() => submitFeedback(app.id)}
  sx={{
    height: 40,
    position: 'relative',
  }}
>
  {loadingFeedbackId === app.id ? (
    <CircularProgress size={20} sx={{ color: 'white' }} />
  ) : (
    'Save Feedback'
  )}
</Button>

                {app.feedback && (
                  <Box mt={2} p={1.5} bgcolor="#f9f9f9" borderRadius={2}>
                    <Typography variant="subtitle2">Previous Feedback:</Typography>
                    <Typography variant="body2" color="text.secondary">{app.feedback}</Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
    </>
  );
}

function getStatusColor(status) {
  switch (status) {
    case 'Applied': return 'primary';
    case 'Interviewing': return 'info';
    case 'Offer': return 'warning';
    case 'Rejected': return 'error';
    case 'Hired': return 'success';
    default: return 'default';
  }
}

export default AdminPanel;


