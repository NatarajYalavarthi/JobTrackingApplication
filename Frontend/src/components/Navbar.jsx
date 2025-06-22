


import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from '../api/axios';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('/user', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setUser(res.data);
        const { name, role } = res.data;
        localStorage.setItem('userdata', JSON.stringify({ name, role }));
      } catch (err) {
        console.error('Failed to fetch user:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.clear();
    navigate('/login');
  };

  if (loading) return null;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <div className="navbar-brand">
          Job Tracker
        </div>

        <div className="collapse navbar-collapse d-flex justify-content-end">
          <ul className="navbar-nav me-auto">
            {/* Applicant Routes */}
            {user?.role === 'applicant' && (
              <>
                <li className="nav-item">
                  <Link
                    to="/dashboard"
                    className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
                  >
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/applications"
                    className={`nav-link ${location.pathname === '/applications' ? 'active' : ''}`}
                  >
                    Applied Jobs
                  </Link>
                </li>
              </>
            )}

            {/* Admin Routes */}
            {user?.role === 'admin' && (
              <>
                <li className="nav-item">
                  <Link
                    to="/admin"
                    className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}
                  >
                    Admin Panel
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/adminDashboard"
                    className={`nav-link ${location.pathname === '/adminDashboard' ? 'active' : ''}`}
                  >
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/postjobs"
                    className={`nav-link ${location.pathname === '/postjobs' ? 'active' : ''}`}
                  >
                    Post Jobs
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/feedback"
                    className={`nav-link ${location.pathname === '/feedback' ? 'active' : ''}`}
                  >
                    Feedbacks
                  </Link>
                </li>
              </>
            )}
          </ul>

          <div className="d-flex align-items-center">
            <span className="navbar-text text-white me-3">
              Hi, {user?.name} ({user?.role})
            </span>
            <button className="btn btn-outline-light" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
