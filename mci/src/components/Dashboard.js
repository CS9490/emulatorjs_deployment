import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MCIRetroVaultImage from '../img/MCIRetro_Vault.png';
import AuthService from '../services/AuthService';

function Dashboard() {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState('');
  const [favorites, setFavorites] = useState([]);

  const getUserToken = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.access_token;
  };

  useEffect(() => {
    const fetchUserEmailAndFavorites = async () => {
      const token = getUserToken();
      if (token) {
        try {
          // Fetch user email
          const emailResponse = await fetch('http://127.0.0.1:5000/user_email', {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (emailResponse.ok) {
            const emailData = await emailResponse.json();
            setUserEmail(emailData.email);
          } else {
            console.error('Failed to fetch user email');
          }

          // Fetch user favorites
          const favoritesResponse = await fetch('http://127.0.0.1:5000/get_favorites', {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (favoritesResponse.ok) {
            const favoritesData = await favoritesResponse.json();
            setFavorites(favoritesData);
          } else {
            console.error('Failed to fetch favorites');
          }
        } catch (error) {
          console.error('Error:', error);
        }
      }
    };

    fetchUserEmailAndFavorites();
  }, []);

  const handleLogout = () => {
    AuthService.logout();
    navigate('/');
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
            <Link to="/platforms" className="header-button">Platforms</Link>
            <Link to="/search" className="header-button">Search</Link>
            <button onClick={handleLogout} className="header-button">Logout</button>
          </div>
        </div>
      </header>
      <main style={{ padding: '20px' }}>

      <div>
        <div className='user-header'>
          <strong> <center> Dashboard </center> </strong>
        </div>
        <div className='user'>
          <center>
            Current user: {userEmail}
          </center>
            </div>

          <div className='block'><div className='user'>Your favorites:</div></div>
          {favorites.map(favorite => (
            <div key={favorite.id}>
                <div class="flex-container">
                  <div class='card'> 
                    <Link to={`/about/${ favorite.platform_id }/${ favorite.id }`}>
                            <img src={ favorite.image.icon_url }/>
                            <div class="item">
                                <h4><b> { favorite.name } </b></h4>
                            </div>
                        </Link>
                  </div>
                  </div>
                </div>
          ))}
      </div> 
      </main>
    </>
  );
}

export default Dashboard;
