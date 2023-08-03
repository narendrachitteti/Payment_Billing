import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logo from './logo.jpg'


const styles = {
  h2: {
    fontSize: '24px',
    color: 'black',
    textAlign: 'center',
  },
  inputBox: {
    position: 'relative',
    width: '310px',
    margin: '20px 0',
    borderBottom: '2px solid black',
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
  errorMessage: {
    color: 'red',
    textAlign: 'center',
    marginBottom: '20px',
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
    margin: '10px 0',
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
};

const RegisterPage = () => {
  const initialFormData = {
    username: '',
    email: '',
    password: '',
    repassword: '',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.username || !formData.email || !formData.password || !formData.repassword) {
      alert('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.repassword) {
      alert('Passwords do not match');
      return;
    }

    createMerchant();
  };

  const createMerchant = async () => {
    setSubmitting(true);
    try {
      const data = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        repassword: formData.repassword,
      };

      const response = await axios.post('http://localhost:3001/register_data', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log(response);
      alert('Registration successfully submitted');
      setError('');
      setPasswordError('');
      resetForm();

      navigate('/InvoiceForm', { state: { username: formData.username } });
    } catch (error) {
      console.error(error);
      setError('Internal Server Error');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
  };

  return (
    <section style={styles.section}>
      <div className="login-box" style={styles.loginBox}>
        <form action="" onSubmit={handleSubmit}>
        <img src={logo} alt="Image" style={{width:'75px',marginLeft:'-40px'}}/>
          <h2 style={styles.h2}>Register</h2>
          <div className="input-box" style={styles.inputBox}>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              data-aos="fade-right"
              style={styles.input}
            />
            <label style={{ ...styles.inputLabel, ...(formData.username && styles.inputFocusLabel) }}>Username</label>
          </div>
          <div className="input-box" style={styles.inputBox}>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              data-aos="fade-right"
              style={styles.input}
            />
            <label style={{ ...styles.inputLabel, ...(formData.email && styles.inputFocusLabel) }}>Email</label>
          </div>
          <div className="input-box" style={styles.inputBox}>
            <span className="icon" style={styles.icon}>
              <ion-icon name="eye-off"></ion-icon>
            </span>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              data-aos="fade-right"
              style={styles.input}
            />
            <label style={{ ...styles.inputLabel, ...(formData.password && styles.inputFocusLabel) }}>Password</label>
          </div>
          <div className="input-box" style={styles.inputBox}>
            <input
              type="password"
              id="repassword"
              name="repassword"
              value={formData.repassword}
              onChange={handleChange}
              data-aos="fade-right"
              style={styles.input}
            />
            <label style={{ ...styles.inputLabel, ...(formData.repassword && styles.inputFocusLabel) }}>
              Re-enter Password
            </label>
          </div>
          {error && <p className="error-message" style={styles.errorMessage}>{error}</p>}
          <button type="submit" disabled={submitting} data-aos="fade-up" style={styles.button}>
            {submitting ? 'Registering...' : 'Register'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default RegisterPage;
