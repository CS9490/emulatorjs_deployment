import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MCIRetroVaultImage from '../img/MCIRetro_Vault.png';
import AuthService from '../services/AuthService'; // importing AuthService
import Iframe from 'react-iframe'

function HomePage() {
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

  return (
    <>
      <header>
        <div className="header-container">
          <div className="header-left">
            <img src={MCIRetroVaultImage} alt="MCIRetro Vault" style={{ width: '100px', height: 'auto' }} />
            <h1>MCIRetroVault</h1>
          </div>
          <div className="header-right">
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
          <strong> <center> Welcome to MCIRetroVault </center> </strong>
        </div>
      </main>

      <body>
        <center>

        <p> TOTAL REGISTERED USERS: {totalUsers} </p> {/* Display the total number of registered users */}
        {user ? (
              <>
                {/* User is logged in */}
                <p> Welcome back! </p>
                {/* Add more links as needed */}
              </>
            ) : (
              <>
                {/* User is not logged in */}
                <p> <Link to="/signup">Sign up</Link> to be a part of this growing number! </p> 
              </>
            )}

        <p> Click <Link to="/platforms">here</Link> to look at our supported platforms, and click <Link to="/search">here</Link> to find some games.</p> 
        <p> Happy gaming! </p> 
        </center>
      </body>

      <div align="center" className='game-container'>
        <Iframe 
          position="absolute" 
          width="100%" 
          id="game" 
          height="100%" 
          styles={{height: "480px", width: "640px"}}
          src="https://www.youtube.com/embed/L0iWBEJgrfE?si=rsR4P0SniR6Ob8JE"
        />
      </div>

      <div className='more'>
        <center> <strong>
        <Link to='/about-us'> <button type="submit" className="like-button">About Us</button></Link>
        <Link to='/resources'> <button type="submit" className="like-button">Other Resources</button></Link>
        </strong> </center>
      </div>
      
    </>
  );
}

export default HomePage;
