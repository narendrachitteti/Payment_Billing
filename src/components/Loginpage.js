import React, { useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import RegisterPage from './RegisterPage';
import InvoiceForm from './InvoiceForm';
import backgroundImage from './background.jpg';
import logo from './logo.jpg'
import ForgotPassword from './ForgotPassword';

const styles = {
  
  section1: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100vh',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  loginBox1: {
    position: 'relative',
    width: '490px',
    height: '547px',
    background: 'white',
    border: '2px solid #ececec',
    borderRadius: '20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  section2: {
    display: 'flex',
    justifyContent: 'center',

  },
  loginBox2: {
    position: 'relative',
    backgroundSize:'auto',
    
  },
  h2: {
    fontSize: '24px',
    color: 'black',
    textAlign: 'center',
  },
  h5: {
    fontSize: '10px',
    textAlign: 'center',
    letterSpacing: '1.28px',
  },
  inputBox: {
    position: 'relative',
    width: '310px',
    margin: '30px 0',
    borderBottom: '2px solid black',
  },
  inputLabel: {
    fontFamily: 'Open Sans, sans-serif',
    position: 'absolute',
    top: '50%',
    left: '5px',
    transform: 'translateY(-50%)',
    fontSize: '1em',
    color: 'black',
    pointerEvents: 'none',
    transition: '0.5s',
  },
  inputFocusLabel: {
    top: '-5px',
  },
  input: {
    width: '100%',
    height: '50px',
    background: 'transparent',
    border: 'none',
    outline: 'none',
    fontSize: '1em',
    color: 'black',
    padding: '0 35px 0 5px',
  },
  icon: {
    position: 'absolute',
    right: '8px',
    color: 'black',
    fontSize: '1.2em',
    lineHeight: '57px',
  },
  rememberForgot: {
    margin: '-15px 0 15px',
    fontSize: '0.8em',
    fontFamily: 'Open Sans, sans-serif',
    color: 'black',
    display: 'flex',
    justifyContent: 'space-between',
  },
  rememberForgotLabel: {
    marginRight: '3px',
  },
  rememberForgotLink: {
    fontFamily: 'Open Sans, sans-serif',
    color: 'black',
    textDecoration: 'none',
  },
  rememberForgotLinkHover: {
    textDecoration: 'underline',
  },
  button: {
    width: '50%',
    height: '40px',
    background: 'black',
    color: '#fff',
    border: 'none',
    outline: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '1em',
    fontWeight: '500',
  },
  registerLink: {
    fontSize: '0.9em',
    color: 'black',
    fontFamily: 'Open Sans, sans-serif',
    textAlign: 'center',
    margin: '30px 50px 18px',
  },
  registerLinkP: {
    color: '#778899',
    fontFamily: 'Open Sans, sans-serif',
    textDecoration: 'none',
    fontWeight: '600',
  },
  registerLinkA: {
    top: '500px',
    fontFamily: 'Open Sans, sans-serif',
    color: 'black',
    textDecoration: 'none',
    fontWeight: '600',
  },
  registerLinkAHover: {
    top: '450px',
    textDecoration: 'underline',
  },
};

function LoginPage() {
  return (
    <Router>
     <section style={styles.section2}>
      <div className="login-box" style={styles.loginBox2}>
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/RegisterPage" element={<RegisterPage />} />
          <Route path="/ForgotPassword" element={<ForgotPassword />} />
          <Route path="/InvoiceForm" element={<InvoiceForm />} />
        </Routes>
      </div></section>
    </Router>
  );
}

const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = {
        username: formData.username,
        password: formData.password,
      };

      const response = await axios.post('http://localhost:3001/login_page', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log(response);
      setError('');

      navigate('/InvoiceForm', { state: { username: formData.username } });
    } catch (error) {
      console.error(error);
      setError('Internal Server Error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form action="" onSubmit={handleSubmit} style={{}}>
      <img src={logo} alt="" style={{width:'75px',marginLeft:'-40px'}}/>
      <h2 style={styles.h2}>Login</h2>
      <div className="input-box" style={styles.inputBox}>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
          data-aos="fade-right"
          style={styles.input}
        />
        <label style={{ ...styles.inputLabel, ...(formData.username && styles.inputFocusLabel) }}>Username</label>
      </div>
      <div className="input-box" style={styles.inputBox}>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          data-aos="fade-right"
          style={styles.input}
        />
        <label style={{ ...styles.inputLabel, ...(formData.password && styles.inputFocusLabel) }}>Password</label>
      </div>
      <div className="remember-forgot" style={styles.rememberForgot}>
        <label>
          <input type="checkbox" style={styles.rememberForgotLabel} />
          Remember me
        </label>
        <a href="#" style={styles.rememberForgotLink}>
          <i>
            <Link to="/ForgotPassword" style={styles.rememberForgotLink}>
              Forgotten Password?
            </Link>
          </i>
        </a>
      </div>

      <button type="submit" disabled={submitting} data-aos="fade-up" style={styles.button}>
        {submitting ? 'Submitting...' : 'Login'}
      </button>
      <div className="register-link" style={styles.registerLink}>
        <p style={styles.registerLinkP}>
          Don't have an account? <Link to="/RegisterPage" style={styles.registerLinkA}>Register</Link>
        </p>
      </div>
    </form>
    
  );
};

export default LoginPage;