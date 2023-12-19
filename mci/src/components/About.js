import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import MCIRetroVaultImage from '../img/MCIRetro_Vault.png';
import AuthService from '../services/AuthService';
import axios from 'axios';

function AboutPage() {
    const navigate = useNavigate();
    const { platform, game } = useParams();
    const [gameData, setGameData] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);

    const safeParse = (data) => {
        try {
            return JSON.parse(data);
        } catch (e) {
            return null;
        }
    };
    const user = safeParse(localStorage.getItem('user'));

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get(`http://127.0.0.1:5000/display_info`, {
                    params: { game: game },
                });
                setGameData(response.data);
            } catch (error) {
                console.error("Error fetching game data: ", error);
            }
    
            const token = AuthService.getCurrentToken();
            if (token && game) {
                try {
                    const favoriteResponse = await axios.get(`http://127.0.0.1:5000/is_favorite?game=${game}&platform=${platform}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setIsFavorite(favoriteResponse.data.isFavorite);
                } catch (error) {
                    console.error("Error checking favorite status: ", error);
                }
            }
        }
    
        fetchData();
    }, [game, platform]);

    const handleLogout = () => {
        AuthService.logout();
        navigate('/');
    };

    const handleToggleFavorite = async () => {
        const token = AuthService.getCurrentToken();
        const endpoint = isFavorite ? 'remove_favorite' : 'add_favorite';

        try {
            await axios.post(`http://127.0.0.1:5000/${endpoint}?game=${game}&platform=${platform}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setIsFavorite(!isFavorite);
        } catch (error) {
            console.error("Error toggling favorite status: ", error);
        }
    };


    const descExists = () => {
        if (!gameData || !gameData.description) {
            return (<center>No data exists for this game.</center>);
        } else {
            return (
                <div className='block'>
                    <div className='desc'>
                        <center>
                            <strong>
                                © {gameData.publishers && gameData.publishers[0] && gameData.publishers[0].name.toUpperCase()} <br />
                                {gameData.original_release_date}
                            </strong>
                        </center>
                    </div>
                    {user && (
                        <div className="block">
                            <button onClick={handleToggleFavorite} className='like-button'>
                                {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                            </button>
                        </div>
                    )}
                    <div className='block'>
                        <div className="disabled">
                            <p dangerouslySetInnerHTML={{ __html: gameData.description }} />
                        </div>
                    </div>
                    <center>
                        <Link to={`/play/${platform}/${game}`}>
                            <button type="submit" className="play-button">Play Game</button>
                        </Link>
                    </center>
                </div>
            );
        }
    };

    if (!gameData) {
        return <div>Loading...</div>;
    }

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
                        {user ? (
                            <button onClick={handleLogout} className="header-button">Logout</button>
                        ) : (
                            <>
                                <Link to="/signin" className="header-button">Sign In</Link>
                                <Link to="/signup" className="header-button">Sign Up</Link>
                            </>
                        )}
                    </div>
                </div>
            </header>

            <body>
                <center>
                    <div className="header">
                        <strong>{gameData.name.toUpperCase()}</strong>
                    </div>
                    <div className='header'>
                        <img src={gameData.image.small_url} alt={gameData.name} />
                    </div>
                </center>

                {descExists()}
            </body>
        </>
    );
}

export default AboutPage;
