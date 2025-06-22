// import React, { useEffect, useState } from 'react';
// import {
//   Typography, Table, TableBody, TableCell, TableContainer,
//   TableHead, TableRow, Paper, CircularProgress, Box
// } from '@mui/material';
// import axios from '../api/axios';

// function ApplicationFeedback({ applicationId }) {
//   const [feedbackList, setFeedbackList] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchFeedback = async () => {
//         debugger
//       try {
//         const token = localStorage.getItem('token');
//         const res = await axios.get('/feedback/get', {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         setFeedbackList(res.data);
//       } catch (err) {
//         console.error('Error fetching feedback:', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchFeedback();
//   }, [applicationId]);

//   if (loading) {
//     return (
//       <Box display="flex" justifyContent="center" mt={4}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   if (feedbackList.length === 0) {
//     return <Typography variant="body1" mt={3} color="text.secondary">No feedback found.</Typography>;
//   }

//   return (
//     <Box mt={4}>
//       <Typography variant="h6" gutterBottom>Feedback History</Typography>
//       <TableContainer component={Paper}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Feedback</TableCell>
//               <TableCell>Given By</TableCell>
//               <TableCell>Applicant</TableCell>
//               <TableCell>Company</TableCell>
//               <TableCell>Date</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {feedbackList.map((fb, idx) => (
//               <TableRow key={idx}>
//                 <TableCell>{fb.feedback}</TableCell>
//                 <TableCell>{fb.givenBy}</TableCell>
//                 <TableCell>{fb.applicantName}</TableCell>
//                 <TableCell>{fb.company}</TableCell>
//                 <TableCell>{new Date(fb.createdAt).toLocaleString()}</TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </Box>
//   );
// }

// export default ApplicationFeedback;


import React, { useEffect, useState } from 'react';
import axios from '../api/axios';

function ApplicationFeedback({ applicationId }) {
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/feedback/get', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFeedbackList(res.data);
      } catch (err) {
        console.error('Error fetching feedback:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, [applicationId]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (feedbackList.length === 0) {
    return (
      <div className="container mt-4">
        <div className="alert alert-info text-center" role="alert">
          No feedback found.
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="card shadow-sm border-0">
        <div className="card-body">
          <h5 className="card-title mb-3 text-primary">Feedback History</h5>
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead style={{ backgroundColor: '#007bff', color: '#fff' }}>
                <tr>
                  <th>Feedback</th>
                  <th>Given By</th>
                  <th>Applicant</th>
                  <th>Company</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {feedbackList.map((fb, idx) => (
                  <tr key={idx}>
                    <td>{fb.feedback}</td>
                    <td>{fb.givenBy}</td>
                    <td>{fb.applicantName}</td>
                    <td>{fb.company}</td>
                    <td>{new Date(fb.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApplicationFeedback;
