import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MCIRetroVaultImage from '../img/MCIRetro_Vault.png';
import AuthService from '../services/AuthService'; // importing AuthService
import $ from 'jquery';

function Resources() {
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
          <strong> <center> Resources </center> </strong>
        </div>
      </main>

      <div className='block'>
      <img className="fit-img" src="https://scontent-lga3-1.xx.fbcdn.net/v/t39.30808-6/277772142_425512079379541_6759675794961238142_n.jpg?stp=dst-jpg_s960x960&_nc_cat=103&ccb=1-7&_nc_sid=783fdb&_nc_ohc=VNOrSUWqbzwAX9hUiek&_nc_ht=scontent-lga3-1.xx&oh=00_AfBnESBzoqDOiVkql05JJsoSWL32T839npsF1LvIwOO1jw&oe=6586522C"></img>
        <div className='block'>
            <strong><Link to="https://tcrf.net/The_Cutting_Room_Floor">The Cutting Room Floor (TCRF) </Link></strong>
            <p>
                The Cutting Room Floor is a community-driven site dedicated to documenting unused or obscure content in video games.
                It's a great resource that gives a lot of context into game development and how much it can change up to a game's release.
            </p>
        </div>
        <div className='block'>
            <strong><Link to="https://hiddenpalace.org/">
                Hidden Palace</Link></strong>
            <p>
                Hidden Palace is a community-driven site dedicated to preserving lost builds and prototypes of video games.
                In addition to their extensive archive of media that would be lost if not for them, but they do a fantastic
                job providing supplemental essays that provide history to both game development and the game industry at the time.
            </p>
        </div>
        <div className='block'>
            <strong><Link to="https://www.arcade-museum.com/">Museum of the Game</Link></strong>
            <p>
                This online museum is one of the oldest and most trusted sources for archives of arcade games.
                They've even published a set of books about coin-operated amusement machines, like slot machines or pinball machines,
                in addition to arcade games.
            </p>
        </div>
        <div className='block'>
            <strong><Link to="https://www.giantbomb.com/">Giant Bomb</Link></strong>
            <p>
                This website is the home of our main API! Giant Bomb is perhaps the most extensive and well-known online video game databases
                out there. With games added daily and tons of ways to search for games (You can search for games by which characters were killed in them),
                it's no wonder why this is still a very important website to this day.
            </p>
        </div>
        <div className='block'>
            <strong><Link to="https://www.mobygames.com/">MobyGames</Link></strong>
            <p>
                MobyGames is another popular video game database. They too have their own API, which we also considered using!
                While Giant Bomb is generally more well-known, MobyGames is also a great choice for a gaming database, and
                outdates Giant Bomb, beginning all the way in 1999! One of their most popular features is to show what video games 
                were released on the current day.
            </p>
        </div>

      </div>

    </>
  );
}

export default Resources ;