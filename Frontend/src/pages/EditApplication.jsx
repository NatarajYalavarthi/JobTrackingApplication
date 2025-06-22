import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// import { AuthContext } from '../context/AuthContext';
import { styled } from '@mui/material/styles';
import { 
  Container, 
  Typography, 
  Button, 
  Paper, 
  Grid, 
  Card, 
  CardContent, 
  TextField, 
  MenuItem, 
  Divider, 
  List, 
  ListItem, 
  ListItemText, 
  Chip, 
  CircularProgress, 
  IconButton 
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

const PREFIX = 'ApplicationDetail';
const classes = {
  root: `${PREFIX}-root`,
  paper: `${PREFIX}-paper`,
  statusChip: `${PREFIX}-statusChip`,
  roundItem: `${PREFIX}-roundItem`,
  feedbackItem: `${PREFIX}-feedbackItem`,
};

const Root = styled('div')(({ theme }) => ({
  [`&.${classes.root}`]: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  [`& .${classes.paper}`]: {
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  [`& .${classes.statusChip}`]: {
    color: 'white',
    fontWeight: 'bold',
  },
  [`& .${classes.roundItem}`]: {
    marginBottom: theme.spacing(2),
  },
  [`& .${classes.feedbackItem}`]: {
    backgroundColor: theme.palette.grey[100],
    marginBottom: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
  },
}));

const statusOptions = [
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

function ApplicationDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  // const { user } = useContext(AuthContext);
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    applied_date: new Date(),
    status: 'Applied',
  });
  const [newRound, setNewRound] = useState({
    title: '',
    notes: '',
    scheduled_at: new Date(),
  });
  const [showRoundForm, setShowRoundForm] = useState(false);
  const [newFeedback, setNewFeedback] = useState({
    comments: '',
  });
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const userData = JSON.parse(localStorage.getItem('userdata'));


  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const res = await axios.get(`/api/applications/${id}`);
        setApplication(res.data);
        setFormData({
          title: res.data.title,
          company: res.data.company,
          applied_date: new Date(res.data.applied_date),
          status: res.data.status,
        });
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    
    fetchApplication();
  }, [id]);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSave = async () => {
    try {
      const res = await axios.put(`/api/applications/${id}`, {
        title: formData.title,
        company: formData.company,
        applied_date: formData.applied_date,
        status: formData.status,
      });
      setApplication(res.data);
      setEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancel = () => {
    setFormData({
      title: application.title,
      company: application.company,
      applied_date: new Date(application.applied_date),
      status: application.status,
    });
    setEditing(false);
  };

  const handleAddRound = async () => {
    try {
      const res = await axios.post('/api/rounds', {
        applicationId: id,
        ...newRound,
      });
      setApplication({
        ...application,
        rounds: [...application.rounds, res.data],
      });
      setNewRound({
        title: '',
        notes: '',
        scheduled_at: new Date(),
      });
      setShowRoundForm(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteRound = async (roundId) => {
    try {
      await axios.delete(`/api/rounds/${roundId}`);
      setApplication({
        ...application,
        rounds: application.rounds.filter(r => r.id !== roundId),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddFeedback = async () => {
    try {
      const res = await axios.post('/api/feedbacks', {
        applicationId: id,
        comments: newFeedback.comments,
      });
      setApplication({
        ...application,
        feedbacks: [...application.feedbacks, res.data],
      });
      setNewFeedback({
        comments: '',
      });
      setShowFeedbackForm(false);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <Container className={classes.root}>
        <CircularProgress />
      </Container>
    );
  }

  if (!application) {
    return (
      <Container className={classes.root}>
        <Typography variant="h6">Application not found</Typography>
      </Container>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Root className={classes.root}>
        <Paper className={classes.paper}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={8}>
              {editing ? (
                <>
                  <TextField
                    label="Job Title"
                    fullWidth
                    margin="normal"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                  <TextField
                    label="Company"
                    fullWidth
                    margin="normal"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  />
                  <DatePicker
                    label="Applied Date"
                    fullWidth
                    value={formData.applied_date}
                    onChange={(date) => setFormData({ ...formData, applied_date: date })}
                    renderInput={(params) => <TextField {...params} margin="normal" fullWidth />}
                  />
                  <TextField
                    select
                    label="Status"
                    fullWidth
                    margin="normal"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    {statusOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </>
              ) : (
                <>
                  <Typography variant="h4">{application.title}</Typography>
                  <Typography variant="h6" color="textSecondary">
                    {application.company}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    Applied on: {new Date(application.applied_date).toLocaleDateString()}
                  </Typography>
                  <Chip
                    label={application.status}
                    style={{ backgroundColor: statusColors[application.status] }}
                    className={classes.statusChip}
                  />
                </>
              )}
            </Grid>
            <Grid item xs={12} md={4}>
              {editing ? (
                <>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSave}
                    style={{ marginRight: 8 }}
                  >
                    Save
                  </Button>
                  <Button variant="outlined" onClick={handleCancel}>
                    Cancel
                  </Button>
                </>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<EditIcon />}
                  onClick={handleEdit}
                >
                  Edit
                </Button>
              )}
            </Grid>
          </Grid>
        </Paper>

        <Paper className={classes.paper}>
          <Typography variant="h5" gutterBottom>
            Interview Rounds
          </Typography>
          
          {application.rounds?.length > 0 ? (
            <List>
              {application.rounds.map((round) => (
                <Paper key={round.id} className={classes.roundItem} elevation={2}>
                  <ListItem>
                    <ListItemText
                      primary={round.title}
                      secondary={
                        <>
                          <Typography component="span" variant="body2" display="block">
                            Scheduled: {new Date(round.scheduled_at).toLocaleString()}
                          </Typography>
                          {round.notes && (
                            <Typography component="span" variant="body2" display="block">
                              Notes: {round.notes}
                            </Typography>
                          )}
                        </>
                      }
                    />
                    <IconButton edge="end" onClick={() => handleDeleteRound(round.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </ListItem>
                </Paper>
              ))}
            </List>
          ) : (
            <Typography variant="body1" color="textSecondary">
              No interview rounds scheduled yet.
            </Typography>
          )}
          
          {showRoundForm ? (
            <Card style={{ marginTop: 16 }}>
              <CardContent>
                <TextField
                  label="Round Title"
                  fullWidth
                  margin="normal"
                  value={newRound.title}
                  onChange={(e) => setNewRound({ ...newRound, title: e.target.value })}
                />
                <TextField
                  label="Notes"
                  fullWidth
                  margin="normal"
                  multiline
                  rows={3}
                  value={newRound.notes}
                  onChange={(e) => setNewRound({ ...newRound, notes: e.target.value })}
                />
                <DatePicker
                  label="Scheduled Date/Time"
                  fullWidth
                  value={newRound.scheduled_at}
                  onChange={(date) => setNewRound({ ...newRound, scheduled_at: date })}
                  renderInput={(params) => <TextField {...params} margin="normal" fullWidth />}
                />
                <div style={{ marginTop: 16 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddRound}
                    style={{ marginRight: 8 }}
                  >
                    Add Round
                  </Button>
                  <Button variant="outlined" onClick={() => setShowRoundForm(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => setShowRoundForm(true)}
              style={{ marginTop: 16 }}
            >
              Add Interview Round
            </Button>
          )}
        </Paper>

        <Paper className={classes.paper}>
          <Typography variant="h5" gutterBottom>
            Feedback
          </Typography>
          
          {application.feedbacks?.length > 0 ? (
            <List>
              {application.feedbacks.map((feedback) => (
                <div key={feedback.id} className={classes.feedbackItem}>
                  <ListItem>
                    <ListItemText
                      primary={feedback.comments}
                      secondary={`By ${feedback.creator?.name} on ${new Date(feedback.createdAt).toLocaleDateString()}`}
                    />
                  </ListItem>
                </div>
              ))}
            </List>
          ) : (
            <Typography variant="body1" color="textSecondary">
              No feedback yet.
            </Typography>
          )}
          
          {(userData?.role === 'admin') ? (
            showFeedbackForm ? (
              <Card style={{ marginTop: 16 }}>
                <CardContent>
                  <TextField
                    label="Comments"
                    fullWidth
                    margin="normal"
                    multiline
                    rows={3}
                    value={newFeedback.comments}
                    onChange={(e) => setNewFeedback({ ...newFeedback, comments: e.target.value })}
                  />
                  <div style={{ marginTop: 16 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleAddFeedback}
                      style={{ marginRight: 8 }}
                    >
                      Add Feedback
                    </Button>
                    <Button variant="outlined" onClick={() => setShowFeedbackForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => setShowFeedbackForm(true)}
                style={{ marginTop: 16 }}
              >
                Add Feedback
              </Button>
            )
          ) : null}
        </Paper>
      </Root>
    </LocalizationProvider>
  );
}

export default ApplicationDetail;