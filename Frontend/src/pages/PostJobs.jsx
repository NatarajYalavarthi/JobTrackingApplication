import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import {
  Typography, Box, TextField, Button, Dialog,
  DialogTitle, DialogContent, DialogActions,
  DialogContentText, Paper, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow,
  IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

function AddApplication() {
  const [jobPostings, setJobPostings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openJobDialog, setOpenJobDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingJobId, setEditingJobId] = useState(null);

  const [newJob, setNewJob] = useState({
    title: '',
    company: '',
    description: '',
    requirements: '',
    location: ''
  });

  const role = localStorage.getItem('userRole');
  const isAdmin = role === 'admin';

  const handleOpenJobDialog = () => {
    setEditMode(false);
    setOpenJobDialog(true);
  };

  const handleCloseJobDialog = () => {
    setOpenJobDialog(false);
    setEditMode(false);
    setEditingJobId(null);
    setNewJob({
      title: '',
      company: '',
      description: '',
      requirements: '',
      location: ''
    });
  };

  const handleJobInputChange = (e) => {
    const { name, value } = e.target;
    setNewJob(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePostOrUpdateJob = async () => {
    try {
      const token = localStorage.getItem('token');
      if (editMode) {
        await axios.put(`/updatejob/${editingJobId}`, newJob, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Job updated');
      } else {
        await axios.post('/createjob', newJob, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Job created');
      }
      handleCloseJobDialog();
      fetchJobs();
    } catch (err) {
      console.error('Error saving job:', err);
    }
  };

  const handleEditJob = (job) => {
    setNewJob({
      title: job.title,
      company: job.company,
      description: job.description,
      requirements: job.requirements,
      location: job.location
    });
    setEditingJobId(job.id);
    setEditMode(true);
    setOpenJobDialog(true);
  };

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/getjobs', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobPostings(res.data);
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  if (isLoading) {
    return (
      <Box className="d-flex justify-content-center align-items-center" sx={{ height: '80vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </Box>
    );
  }

  return (
    <Box className="container py-5">
      <Typography variant="h4" className="text-center text-primary mb-4 fw-bold">
        Available Job Opportunities
      </Typography>

      {isAdmin && (
        <Box className="d-flex justify-content-end mb-3">
          <Button variant="contained" color="primary" onClick={handleOpenJobDialog}>
            Post Job
          </Button>
        </Box>
      )}

      {jobPostings.length === 0 ? (
        <div className="alert alert-info text-center">No job postings available at the moment.</div>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
          <Table sx={{ minWidth: 1200 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#1976d2' }}>
                {['Title', 'Company', 'Location', 'Description', 'Requirements', 'Action'].map((head, idx) => (
                  <TableCell key={idx} sx={{ color: 'white', fontWeight: 'bold' }}>
                    {head}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
           <TableBody>
  {jobPostings.map((job) => (
    <TableRow key={job.id} hover sx={{ '& td': { py: 1.2, px: 1.5 } }}>
      <TableCell>{job.title}</TableCell>
      <TableCell>{job.company}</TableCell>
      <TableCell>{job.location || 'Remote'}</TableCell>
      <TableCell>{job.description}</TableCell>
      <TableCell>{job.requirements}</TableCell>
      <TableCell>
        <IconButton onClick={() => handleEditJob(job)} color="primary" size="small">
          <EditIcon fontSize="small" />
        </IconButton>
      </TableCell>
    </TableRow>
  ))}
</TableBody>

          </Table>
        </TableContainer>
      )}

      {/* Dialog for Posting or Editing Jobs */}
      <Dialog open={openJobDialog} onClose={handleCloseJobDialog} maxWidth="md" fullWidth>
        <DialogTitle>{editMode ? 'Edit Job' : 'Post New Job'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {editMode ? 'Update the job details below:' : 'Fill in the job details to post a new opportunity.'}
          </DialogContentText>

          {['title', 'company', 'location', 'description', 'requirements'].map((field, index) => (
            <Box mt={2} key={index}>
              <TextField
                fullWidth
                label={field.charAt(0).toUpperCase() + field.slice(1)}
                name={field}
                multiline={field === 'description' || field === 'requirements'}
                rows={field === 'description' || field === 'requirements' ? 3 : 1}
                value={newJob[field]}
                onChange={handleJobInputChange}
              />
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseJobDialog}>Cancel</Button>
          <Button onClick={handlePostOrUpdateJob} variant="contained" color="primary">
            {editMode ? 'Update Job' : 'Post Job'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AddApplication;
