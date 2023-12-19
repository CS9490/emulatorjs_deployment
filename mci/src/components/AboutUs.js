import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MCIRetroVaultImage from '../img/MCIRetro_Vault.png';
import AuthService from '../services/AuthService'; // importing AuthService
import $ from 'jquery'

function AboutUs() {
  const navigate = useNavigate();
  const safeParse = (data) => {
    try {
      return JSON.parse(data);
    } catch (e) {
      return null;
    }
  };
  const user = safeParse(localStorage.getItem('user'));
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/users')
      .then((response) => response.json())
      .then((data) => {
        console.log('Data from /users:', data); // Make sure this logs the expected object
        setTotalUsers(data.num_users); // Update the state with the number of users
      })
      .catch((error) => {
        console.error('Error fetching total users:', error);
      });
  }, []);
  
  

  const handleLogout = () => {
    AuthService.logout(); // Clear the user session
    navigate('/'); // Redirect to home page or login page
  };

  $(document).ready(function(){
    $(this).scrollTop(0);
}); 

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
            {user ? (
              <>
                {/* User is logged in */}
                <Link to="/platforms" className="header-button">Platforms</Link>
                <Link to="/search" className="header-button">Search</Link>
                <Link to="/dashboard" className="header-button">Dashboard</Link>
                <button onClick={handleLogout} className="header-button">Logout</button>

                {/* Add more links as needed */}
              </>
            ) : (
              <>
                {/* User is not logged in */}
                <Link to="/signin" className="header-button">Sign In</Link>
                <Link to="/signup" className="header-button">Sign Up</Link>
                <Link to="/platforms" className="header-button">Platforms</Link>
                <Link to="/search" className="header-button">Search</Link>
              </>
            )}
          </div>
        </div>
      </header>
      <main>
        <div className='header'>
          <strong> <center> About Us </center> </strong>
        </div>
      </main>

      <div className='block'>
      <img className="ab-img" src="/IMG_4795.JPG"></img>
      </div>

      <div className='desc'>
        <center> <strong>
        <p>Welcome to MCI RetroVault!</p>
        </strong> </center>
      </div>

      <div className='block'>
        <center>
        <p>MCI RetroVault is an online museum where you can learn about and play retro video games from your browser!</p>
        <p>MCI stands for the first letters of our first names: <strong>Miguel</strong>, <strong>Cristian</strong>, and <strong>Ishtiaq</strong>.</p>
        <p>
            We made this website to share our love of video games, 
            and allow people to learn about their favorite games and play them all in one place.
        </p>
        <p>
            We hope you enjoy your visit!
        </p>
        <p>
            © 2023 MCI RetroVault
        </p>
        </center>

      </div>

    </>
  );
}

export default AboutUs;