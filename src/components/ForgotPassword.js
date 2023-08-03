import React, { useState } from 'react';
import axios from 'axios';
import logo from './logo.jpg'

const ForgotPassword = ({ onClose }) => {
  const [passwordData, setPasswordData] = useState({
    newpassword: '',
    confirmpassword: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prevPasswordData) => ({
      ...prevPasswordData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      
      if (passwordData.newpassword !== passwordData.confirmpassword) {
        setError('Passwords do not match');
        return;
      }

      const response = await axios.post('http://localhost:3002/forgot_page', {
        newpassword: passwordData.newpassword,
        confirmpassword: passwordData.confirmpassword,
      });

      console.log(response);
      alert('Password updated successfully');
      setError('');
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <img src={logo} alt="Image" style={{width:'75px',marginLeft:'-40px',marginTop:'-50px'}}/><br/><br/>
      <div className="forgot-password-popup">
        <h1 className="forgot-password-title">Forgot Password</h1><br/>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="newpassword">New Password&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
            <input
              className="input-field"
              type="password"
              id="newpassword"
              name="newpassword"
              placeholder="Enter new password"
              value={passwordData.newpassword}
              onChange={handleChange}
              required
            />
          </div><br/>
          <div className="form-group">
            <label htmlFor="confirmpassword">Confirm Password&nbsp;</label>
            <input
              className="input-field"
              type="password"
              id="confirmpassword"
              name="confirmpassword"
              placeholder="Confirm new password"
              value={passwordData.confirmpassword}
              onChange={handleChange}
              required
            />
          </div><br/><br/>
          {error && <p className="error">{error}</p>}
          <div className="form-group">
            <button className="save-button" type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <div>
      <ForgotPassword />
    </div>
  );
};

export default App;
