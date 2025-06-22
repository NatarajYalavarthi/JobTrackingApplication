

import React, { useState, useEffect  } from 'react';
import axios from '../api/axios';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa'
function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
const location = useLocation();
  const loginSchema = Yup.object({
    email: Yup.string().email('Invalid email format').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });


  useEffect(() => {
  if (location.state?.registered) {
    toast.success('Registration successful! Please login.', {
      position: 'top-right',
      autoClose: 3000,
    });
  }
}, [location.state]);

const handleLogin = async (values, { setSubmitting }) => {
  try {
    const res = await axios.post('/auth/login', values);
    const { token, user } = res.data;

    localStorage.setItem('token', token);
    localStorage.setItem('userRole', user.role);
    localStorage.setItem('userId', user.id);

    if (user.role === 'applicant') {
      navigate('/dashboard');
    } else {
      navigate('/admin');
    }
  } catch (err) {
    console.error('Login error:', err.response?.data || err.message);
    toast.error(err.response?.data?.error || 'Invalid credentials', {
      position: 'top-right',
      autoClose: 3000,
    });
  } finally {
    setSubmitting(false);
  }
};


  return (
    <div
      style={{
        backgroundImage:
          'url(https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1600&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '1rem',
      }}
    >
      <div
        className="card shadow-lg p-4"
        style={{
          width: '100%',
          maxWidth: '420px',
          borderRadius: '1rem',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
        }}
      >
        <div className="text-center mb-4">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="Job Seeker"
            style={{ width: '80px' }}
          />
          <h3 className="fw-bold text-primary mt-3">Welcome Back!</h3>
          <p className="text-muted">Login to explore your dream jobs</p>
        </div>

        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={loginSchema}
          onSubmit={handleLogin}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <Field
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="example@email.com"
                />
                <ErrorMessage name="email" component="div" className="text-danger small" />
              </div>

<div className="mb-3">
  <label className="form-label">Password</label>
  <div className="input-group">
    <Field
      type={showPassword ? 'text' : 'password'}
      name="password"
      className="form-control"
      placeholder="Enter password"
    />
    <button
      type="button"
      className="btn btn-outline-secondary"
      onClick={() => setShowPassword(!showPassword)}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      {showPassword ? <FaEyeSlash /> : <FaEye />}
    </button>
  </div>
  <ErrorMessage name="password" component="div" className="text-danger small" />
</div>

              <button type="submit" className="btn btn-primary w-100 mt-2" disabled={isSubmitting}>
                {isSubmitting ? 'Logging in...' : 'Login'}
              </button>

              <p className="text-center mt-3 small">
                Don't have an account?{' '}
                <Link to="/register" className="text-decoration-none fw-semibold">
                  Register here
                </Link>
              </p>
            </Form>
          )}
        </Formik>
        <ToastContainer position="top-right" autoClose={3000} />

      </div>
    </div>
  );
}

export default Login;

