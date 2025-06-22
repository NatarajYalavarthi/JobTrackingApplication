

// import React, { useState, useEffect } from 'react';
// import axios from '../api/axios';
// import { useNavigate } from 'react-router-dom';

// function AddApplication() {
//   const [jobPostings, setJobPostings] = useState([]);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [activeJobId, setActiveJobId] = useState(null);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [isFileReady, setIsFileReady] = useState(false);
//   const [base64Resume, setBase64Resume] = useState(null);
//   const [submittedJobs, setSubmittedJobs] = useState([]);
//   const [submittedStatuses, setSubmittedStatuses] = useState({});



//   const navigate = useNavigate();

// useEffect(() => {
//   const fetchJobsAndAppliedJobs = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const userId = localStorage.getItem('userId'); // Store this at login

//       const [jobsRes, appliedRes] = await Promise.all([
//         axios.get('/getjobs', {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//         axios.get(`/applications/getbyId/${userId}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//       ]);

//       const appliedStatusMap = {};
//       appliedRes.data.forEach(app => {
//         appliedStatusMap[Number(app.jobpostingId)] = app.status;
//       });
//       setSubmittedJobs(Object.keys(appliedStatusMap).map(id => Number(id)));
//       setSubmittedStatuses(appliedStatusMap);
//       setJobPostings(jobsRes.data);

//     } catch (err) {
//       console.error('Failed to fetch jobs or applied jobs:', err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   fetchJobsAndAppliedJobs();
// }, []);


//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     setSelectedFile(file);
//     setUploadProgress(0);
//     setIsFileReady(false);
//     setBase64Resume(null);

//     if (file) {
//       const reader = new FileReader();

//       reader.onloadend = async () => {
//         // Simulate progress
//         setUploadProgress(30);
//         await new Promise((res) => setTimeout(res, 300));
//         setUploadProgress(60);
//         await new Promise((res) => setTimeout(res, 300));
//         setUploadProgress(100);

//         setBase64Resume(reader.result);
//         setIsFileReady(true);
//       };

//       reader.readAsDataURL(file);
//     }
//   };


//   const handleApplyClick = (jobId) => {
//     setActiveJobId(jobId);
//     setSelectedFile(null);
//   };

//   const handleCancelApply = () => {
//     setActiveJobId(null);
//     setSelectedFile(null);
//   };


// const handleSubmitApplication = async (job) => {
//   try {
//     const token = localStorage.getItem('token');
//     const userId = localStorage.getItem('userId');

//     await axios.post(
//       '/applications/createapp',
//       {
//         jobpostingId: job.id,
//         title: job.title,
//         company: job.company,
//         status: 'Applied',
//         applied_date: new Date(),
//         resume: base64Resume,
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${token}` },
//       }
//     );

//     // ✅ Immediately fetch updated applied jobs
//     const appliedRes = await axios.get(`/applications/getbyId/${userId}`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });

//     const appliedStatusMap = {};
//     appliedRes.data.forEach(app => {
//       appliedStatusMap[Number(app.jobpostingId)] = app.status;
//     });

//     setSubmittedJobs(Object.keys(appliedStatusMap).map(id => Number(id)));
//     setSubmittedStatuses(appliedStatusMap);

//     // ✅ Reset form state
//     setActiveJobId(null);
//     setSelectedFile(null);
//     setIsFileReady(false);
//     setBase64Resume(null);
//     setUploadProgress(0);

//     navigate('/dashboard', { state: { message: 'Application submitted successfully!' } });

//   } catch (err) {
//     console.error('Error applying:', err);
//     alert('Failed to submit application. Please try again.');
//   }
// };



//   if (isLoading) {
//     return (
//       <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
//         <div className="spinner-border text-primary" role="status">
//           <span className="visually-hidden">Loading...</span>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="container-fluid py-5">
//       <div className="text-center mb-5">
//         <h2 className="fw-bold text-primary">Available Job Opportunities</h2>
//         <p className="text-muted">Browse and apply to exciting positions</p>
//       </div>

//       {jobPostings.length === 0 ? (
//         <div className="alert alert-info text-center">No job postings available at the moment.</div>
//       ) : (
//         <div className="row g-4">
//           {jobPostings.map((job) => (
//            <div className="col-lg-6" key={job.id}>
//   <div className="card border-0 shadow-lg h-100 job-card transition-all rounded-4 overflow-hidden">
//       <span
//       className="position-absolute top-0 end-0 m-3 badge bg-warning text-dark fw-semibold shadow-sm"
//       style={{ zIndex: 1 }}
//     >
//       <i className="bi bi-geo-alt-fill me-1"></i>
//       {job.location || 'Remote'}
//     </span>
//     <div className="card-body d-flex flex-column p-4">
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <div>
//           <h4 className="fw-bold text-dark mb-0">{job.title}</h4>
//           <h6 className="text-primary">{job.company}</h6>
//         </div>
//         <span className="badge bg-gradient-primary text-white px-3 py-2 rounded-pill">{job.location}</span>
//       </div>

//       <div className="mb-3">
//         <h6 className="text-uppercase fw-semibold text-muted small mb-1">Description</h6>
//         <p className="text-muted">{job.description}</p>
//       </div>

//       <div className="mb-3">
//         <h6 className="text-uppercase fw-semibold text-muted small mb-1">Requirements</h6>
//         <p className="text-muted">{job.requirements}</p>
//       </div>

//       <div className="mb-3">
//         <h6 className="text-uppercase fw-semibold text-muted small mb-1">Application Status</h6>
//         <span className="badge bg-light border text-dark px-2 py-1 rounded">
//           {submittedStatuses[job.id] || 'Not Applied'}
//         </span>
//       </div>

//       {job.rounds && job.rounds.length > 0 && (
//         <div className="mb-3">
//           <h6 className="text-uppercase fw-semibold text-muted small mb-1">Interview Rounds</h6>
//           <ul className="list-group list-group-flush bg-light rounded shadow-sm">
//             {job.rounds.map((round, idx) => (
//               <li className="list-group-item d-flex align-items-start" key={idx}>
//                 <span className="badge bg-primary me-3">{idx + 1}</span>
//                 <div>
//                   <div className="fw-semibold">{round.title}</div>
//                   <div className="small text-muted">{round.notes}</div>
//                 </div>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}

//       <div className="mt-auto">
//         {submittedJobs.includes(job.id) ? (
//           <button className="btn btn-success w-100 py-2 fw-semibold" disabled>
//             ✅ Applied
//           </button>
//         ) : activeJobId === job.id ? (
//           <div className="apply-section">
//             <div className="mb-3">
//               <label className="form-label fw-semibold">Upload Resume</label>
//               <input
//                 type="file"
//                 className="form-control"
//                 accept=".pdf,.doc,.docx"
//                 onChange={handleFileChange}
//               />
//               {uploadProgress > 0 && (
//                 <div className="progress mt-2">
//                   <div
//                     className="progress-bar progress-bar-striped progress-bar-animated"
//                     style={{ width: `${uploadProgress}%` }}
//                   >
//                     {uploadProgress}%
//                   </div>
//                 </div>
//               )}
//             </div>
//             <div className="d-flex gap-2">
//               <button className="btn btn-outline-secondary flex-grow-1" onClick={handleCancelApply}>
//                 Cancel
//               </button>
//               <button
//                 className={`btn flex-grow-1 ${isFileReady ? 'btn-primary' : 'btn-secondary'}`}
//                 onClick={() => handleSubmitApplication(job)}
//                 disabled={!isFileReady}
//               >
//                 Submit Application
//               </button>
//             </div>
//           </div>
//         ) : (
//           <button className="btn btn-primary w-100 py-2 fw-semibold" onClick={() => handleApplyClick(job.id)}>
//             Apply Now
//           </button>
//         )}
//       </div>
//     </div>
//   </div>
// </div>

//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// export default AddApplication;


import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import {
  Box, Grid, TextField, Card, CardContent, Typography, Table, TableHead,
  TableRow, TableCell, TableBody, Chip, Divider, Stack, Avatar,FormControl , InputLabel, Select, MenuItem
} from '@mui/material';

function AddApplication() {
  const [jobPostings, setJobPostings] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeJobId, setActiveJobId] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isFileReady, setIsFileReady] = useState(false);
  const [base64Resume, setBase64Resume] = useState(null);
  const [submittedJobs, setSubmittedJobs] = useState([]);
  const [submittedStatuses, setSubmittedStatuses] = useState({});
  const [companyFilter, setCompanyFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobsAndAppliedJobs = async () => {
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');

        const [jobsRes, appliedRes] = await Promise.all([
          axios.get('/getjobs', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`/applications/getbyId/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const appliedStatusMap = {};
        appliedRes.data.forEach(app => {
          appliedStatusMap[Number(app.jobpostingId)] = app.status;
        });
        setSubmittedJobs(Object.keys(appliedStatusMap).map(id => Number(id)));
        setSubmittedStatuses(appliedStatusMap);
        setJobPostings(jobsRes.data);

      } catch (err) {
        console.error('Failed to fetch jobs or applied jobs:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobsAndAppliedJobs();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setUploadProgress(0);
    setIsFileReady(false);
    setBase64Resume(null);

    if (file) {
      const reader = new FileReader();

      reader.onloadend = async () => {
        setUploadProgress(30);
        await new Promise((res) => setTimeout(res, 300));
        setUploadProgress(60);
        await new Promise((res) => setTimeout(res, 300));
        setUploadProgress(100);

        setBase64Resume(reader.result);
        setIsFileReady(true);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleApplyClick = (jobId) => {
    setActiveJobId(jobId);
    setSelectedFile(null);
  };

  const handleCancelApply = () => {
    setActiveJobId(null);
    setSelectedFile(null);
  };

  const handleSubmitApplication = async (job) => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      await axios.post(
        '/applications/createapp',
        {
          jobpostingId: job.id,
          title: job.title,
          company: job.company,
          status: 'Applied',
          applied_date: new Date(),
          resume: base64Resume,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
        }
      );

      const appliedRes = await axios.get(`/applications/getbyId/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const appliedStatusMap = {};
      appliedRes.data.forEach(app => {
        appliedStatusMap[Number(app.jobpostingId)] = app.status;
      });

      setSubmittedJobs(Object.keys(appliedStatusMap).map(id => Number(id)));
      setSubmittedStatuses(appliedStatusMap);

      setActiveJobId(null);
      setSelectedFile(null);
      setIsFileReady(false);
      setBase64Resume(null);
      setUploadProgress(0);

      navigate('/dashboard', { state: { message: 'Application submitted successfully!' } });

    } catch (err) {
      console.error('Error applying:', err);
      alert('Failed to submit application. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-5">
      <div className="mb-4">
        <h2 className="fw-bold text-primary text-center">Available Job Opportunities</h2>
        <p className="text-muted text-center mb-4">Browse and apply to exciting positions</p>

        {/* <div className="row justify-content-end  align-items-end">
          <div className="col-md-2 ">
             <TextField
                      label="Filter by Company"
                     value={companyFilter}
                      onChange={(e) => setCompanyFilter(e.target.value)}
                      variant="outlined"
                       style={{ marginTop: "30px" }}
                      //  className='m-3'
                      size="small"
                      sx={{ width: 250 }}
                    />
          </div>
          <div className="col-md-2">
            <FormControl size="small" sx={{ minWidth: 200 }} className='ms-2' >
              
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
          </div>
        </div> */}
        <div className="container mt-4">
  <div className="row g-3 justify-content-end align-items-center">
    {/* Company Filter */}
    <div className="col-12 col-sm-6 col-md-4 col-lg-3">
      <TextField
        label="Filter by Company"
        value={companyFilter}
        onChange={(e) => setCompanyFilter(e.target.value)}
        variant="outlined"
        size="small"
        fullWidth
      />
    </div>

    {/* Status Filter */}
    <div className="col-12 col-sm-6 col-md-4 col-lg-3">
      <FormControl fullWidth size="small">
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
    </div>
  </div>
</div>

      </div>


      {jobPostings.length === 0 ? (
        <div className="alert alert-info text-center">No job postings available at the moment.</div>
      ) : (
        <div className="row g-4">
     {jobPostings
  .filter((job) => {
    const matchesCompany = job.company.toLowerCase().includes(companyFilter.toLowerCase());
    const currentStatus = submittedStatuses[job.id] || 'Not Applied';
    const matchesStatus = statusFilter === 'All' || currentStatus === statusFilter;
    return matchesCompany && matchesStatus;
  })
  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // 🔥 Sort by newest
  .map((job) => (
              <div className="col-sm-12 col-md-6 col-lg-3" key={job.id}>
                <div className="card border-0 shadow-lg h-100 job-card transition-all rounded-4 overflow-hidden">
                  <span
                    className="position-absolute top-0 end-0 m-3 badge bg-warning text-dark fw-semibold shadow-sm"
                    style={{ zIndex: 1 }}
                  >
                    <i className="bi bi-geo-alt-fill me-1"></i>
                    {job.location || 'Remote'}
                  </span>
                  <div className="card-body d-flex flex-column p-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div>
                        <h4 className="fw-bold text-dark mb-0">{job.title}</h4>
                        <h6 className="text-primary">{job.company}</h6>
                      </div>
                      <span className="badge bg-gradient-primary text-white px-3 py-2 rounded-pill">{job.location}</span>
                    </div>

                    <div className="mb-3">
                      <h6 className="text-uppercase fw-semibold text-muted small mb-1">Description</h6>
                      <p className="text-muted">{job.description}</p>
                    </div>

                    <div className="mb-3">
                      <h6 className="text-uppercase fw-semibold text-muted small mb-1">Requirements</h6>
                      <p className="text-muted">{job.requirements}</p>
                    </div>

                    <div className="mb-3">
                      <h6 className="text-uppercase fw-semibold text-muted small mb-1">Application Status</h6>
                      <span className="badge bg-light border text-dark px-2 py-1 rounded">
                        {submittedStatuses[job.id] || 'Not Applied'}
                      </span>
                    </div>

                    {job.rounds && job.rounds.length > 0 && (
                      <div className="mb-3">
                        <h6 className="text-uppercase fw-semibold text-muted small mb-1">Interview Rounds</h6>
                        <ul className="list-group list-group-flush bg-light rounded shadow-sm">
                          {job.rounds.map((round, idx) => (
                            <li className="list-group-item d-flex align-items-start" key={idx}>
                              <span className="badge bg-primary me-3">{idx + 1}</span>
                              <div>
                                <div className="fw-semibold">{round.title}</div>
                                <div className="small text-muted">{round.notes}</div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="mt-auto">
                      {submittedJobs.includes(job.id) ? (
                        <button className="btn btn-success w-100 py-2 fw-semibold" disabled>
                          ✅ Applied
                        </button>
                      ) : activeJobId === job.id ? (
                        <div className="apply-section">
                          <div className="mb-3">
                            <label className="form-label fw-semibold">Upload Resume</label>
                            <input
                              type="file"
                              className="form-control"
                              accept=".pdf,.doc,.docx"
                              onChange={handleFileChange}
                            />
                            {uploadProgress > 0 && (
                              <div className="progress mt-2">
                                <div
                                  className="progress-bar progress-bar-striped progress-bar-animated"
                                  style={{ width: `${uploadProgress}%` }}
                                >
                                  {uploadProgress}%
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="d-flex gap-2">
                            <button className="btn btn-outline-secondary flex-grow-1" onClick={handleCancelApply}>
                              Cancel
                            </button>
                            <button
                              className={`btn flex-grow-1 ${isFileReady ? 'btn-primary' : 'btn-secondary'}`}
                              onClick={() => handleSubmitApplication(job)}
                              disabled={!isFileReady}
                            >
                              Submit Application
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button className="btn btn-primary w-100 py-2 fw-semibold" onClick={() => handleApplyClick(job.id)}>
                          Apply Now
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

export default AddApplication;
