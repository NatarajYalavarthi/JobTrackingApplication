



import React, { useState } from 'react';
import axios from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';


function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
  });

  const handleRegister = async (values, { setSubmitting }) => {
    try {
      await axios.post('/auth/register', values);
        navigate('/login', { state: { registered: true } });
    } catch (err) {
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
            src="https://cdn-icons-png.flaticon.com/512/3135/3135768.png"
            alt="Register"
            style={{ width: '80px' }}
          />
          <h3 className="fw-bold text-success mt-3">Create an Account</h3>
          <p className="text-muted">Join and explore your career opportunities</p>
        </div>

        <Formik
          initialValues={{ name: '', email: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={handleRegister}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-3">
                <label className="form-label">Full Name</label>
                <Field
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="Enter your name"
                />
                <ErrorMessage name="name" component="div" className="text-danger small" />
              </div>

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


              <button
                type="submit"
                className="btn btn-success w-100"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Registering...' : 'Register'}
              </button>

              <p className="text-center mt-3 small">
                Already have an account?{' '}
                <Link to="/login" className="text-decoration-none fw-semibold">
                  Login here
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

export default Register;
