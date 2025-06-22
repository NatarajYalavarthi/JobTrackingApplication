


import { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Card, CardContent,
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, CircularProgress,
  Chip, TextField, MenuItem, Button, Dialog,
  DialogTitle, DialogContent, DialogActions,
  DialogContentText, IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import axios from '../api/axios';

const statusOptions = [
  { value: 'all', label: 'All Statuses' },
  { value: 'Applied', label: 'Applied' },
  { value: 'Interviewing', label: 'Interviewing' },
  { value: 'Offer', label: 'Offer' },
  { value: 'Rejected', label: 'Rejected' },
  { value: 'Hired', label: 'Hired' },
];

const statusColors = {
  Applied: '#FF6384',
  Interviewing: '#36A2EB',
  Offer: '#FFCE56',
  Rejected: '#4BC0C0',
  Hired: '#9966FF',
};

export default function AdminDashboard() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [openJobDialog, setOpenJobDialog] = useState(false);
  const [companyFilter, setCompanyFilter] = useState('');

  const [newJob, setNewJob] = useState({
    title: '',
    company: '',
    description: '',
    requirements: '',
    location: '',
    rounds: [{ title: '', notes: '' }]
  });

  const role = localStorage.getItem('userRole');
  const isAdmin = role === 'admin';

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');

        if (!userId) {
          console.error('User ID not found in localStorage');
          return;
        }
        const res = await axios.get(`/applications/getbyId/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const appData = Array.isArray(res.data) ? res.data : [res.data];

        setApplications(appData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching applications:', err);
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);



  if (loading) return <CircularProgress />;

  const filteredApplications = applications.filter(app => {
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesCompany = app.company.toLowerCase().includes(companyFilter.toLowerCase());
    return matchesStatus && matchesCompany;
  });

  return (
    <Container maxWidth="lg">

      <Box mb={3}>
        <TextField
          select
          label="Filter by Status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          variant="outlined"
          size="small"
          sx={{ width: 200 }}
          style={{ marginTop: "30px" }}
        >
          {statusOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Filter by Company"
          value={companyFilter}
          onChange={(e) => setCompanyFilter(e.target.value)}
          variant="outlined"
           style={{ marginTop: "30px" }}
           className='ms-3'
          size="small"
          sx={{ width: 250 }}
        />
      </Box>

      <Card elevation={3}>
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Job Title</TableCell>
                  <TableCell>Company</TableCell>
                  <TableCell>User Name</TableCell>
                  <TableCell>User Email</TableCell>
                  <TableCell>applied_date</TableCell>
                  <TableCell>Status</TableCell>

                </TableRow>
              </TableHead>
              <TableBody>
                {filteredApplications.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell>{app.title}</TableCell>
                    <TableCell>{app.company}</TableCell>
                    <TableCell>{app.userName}</TableCell>
                    <TableCell>{app.userEmail}</TableCell>
                    <TableCell>{app.applied_date}</TableCell>
                    <TableCell>
                      <Chip
                        label={app.status}
                        sx={{
                          backgroundColor: statusColors[app.status],
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Container>
  );
}
