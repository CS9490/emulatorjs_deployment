import React, { useState } from 'react';
import AuthService from '../services/AuthService';
import MCIRetroVaultImage from '../img/MCIRetro_Vault.png';
import { Link, useNavigate } from 'react-router-dom';

function SignUp() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match");
        return;
    }

    try {
        const response = await AuthService.register(
            formData.firstName,
            formData.lastName,
            formData.email,
            formData.password
        );
        if (response.msg) {
            setSuccessMessage(response.msg);
            setTimeout(() => {
                navigate('/');
            }, 3000); // Redirects after 3 seconds
        }
    } catch (error) {
        console.error(error);
    }
  };

  return (
    <>
    <header>
        <div className="header-container">
          <div className="header-left">
            <img src={MCIRetroVaultImage} alt="MCIRetro Vault" style={{ width: '100px', height: 'auto' }} />
            <h1>MCIRetroVault</h1>
          </div>
          <div className="header-right">
            <Link to="/" className="header-button">Home</Link>
            <Link to="/signin" className="header-button">Sign In</Link>
            <Link to="/search" className="header-button">Search</Link>
          </div>
        </div>
      </header>
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Create Your Account</h2>
        <div className="input-group">
          <label htmlFor="firstName">First Name</label>
          <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required />
        </div>
        <div className="input-group">
          <label htmlFor="lastName">Last Name</label>
          <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required />
        </div>
        <div className="input-group">
          <label htmlFor="email">Email Address</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input type={showPassword ? 'text' : 'password'} id="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>
        <div className="input-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input type={showPassword ? 'text' : 'password'} id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
        </div>
        <button type="button" onClick={togglePasswordVisibility} className="show-password">
          Show password
        </button>
        <button type="submit" className="create-account-button">Create Account</button>
      </form>
      {successMessage && <div className="success-message">{successMessage}</div>}
    </div>
    </>
  );
}

export default SignUp; 