import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import MCIRetroVaultImage from '../img/MCIRetro_Vault.png';
import AuthService from '../services/AuthService';
import $ from 'jquery';

import Iframe from 'react-iframe'

function PlayPage() {
    const navigate = useNavigate();
    const { platform, game } = useParams();
    const [gameData, setGameData] = useState(null);
    const [emulator, setEmulator] = useState("");
    const [BIOS, setBIOS] = useState("");

    const safeParse = (data) => {
        try {
            return JSON.parse(data);
        } catch (e) {
            return null;
        }
    };

    const user = safeParse(localStorage.getItem('user'))
    const DATAPATH = "../../../EmulatorJS-main/data"; // path to EmuJS data folder

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await $.ajax({
                    url: `http://127.0.0.1:5000/display_game`, // Updated Flask route
                    dataType: "json",
                    data: { game: game } // Pass the game ID to your Flask API
                });
                setGameData(response[0]); // Assuming the Flask API returns an array of games
                console.log(response);
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        }
    
        if (game) {
            fetchData();
        }
    }, [game]);

    const handleLogout = () => {
        AuthService.logout();
        navigate('/');
    };

    function getEmulator() { // get the correct core for RetroArch based on Giant Bomb platform
        var core = null;
        switch(platform){
            case 84: core = 'arcade'; break; // arcade
            case 40: core = 'atari2600'; break; // 2600
            case 67: core = 'atari5200'; break; // 5200
            case 70: core = 'atari7800'; break; // 7800
            case 21: core = 'nes'; break; // nes
            case 9: core = 'snes'; break; // snes
            case 43: core = 'n64'; break; // n64
            case 3: core = 'gb'; break; // gb
            case 57: core = 'gb'; break; // gbc
            case 79: core = 'vb'; break; // vb
            case 4: core = 'gba'; break; // gba
            case 8: core = 'segaMS'; break; // sms
            case 6: core = 'segaMD'; break; // gen / mega drive
            case 5: core = 'segaGG'; break; // game gear
            case 22: core = 'psx'; break; // ps1
        }
        setEmulator(core);
    }

    function getBIOS() {
        var path = "";
        switch(platform){
            case 21: path = ""; break; // insert FDS bios here
            case 8: path = ""; break; // insert master system US bios here
            case 6: path = ""; break; // insert MD TMSS startup rom here
            case 22: path = ""; break; // insert PS1 US bios here
        }
        setBIOS(path);
    }

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
                            <>
                                <button onClick={handleLogout} className="header-button">Logout</button>
                            </>
                        ) : (
                            <>
                                <Link to="/signin" className="header-button">Sign In</Link>
                                <Link to="/signup" className="header-button">Sign Up</Link>
                            </>
                        )}

                    </div>
                </div>
            </header>

            <div>
                <center>
                    <div className="header">
                        <strong>PLAY {gameData.name.toUpperCase()}</strong>
                    </div>
                </center>

                <div align="center" className='game-container'>
                    <Iframe 
                        position="absolute" 
                        width="100%" 
                        id="game" 
                        height="100%" 
                        styles={{height: "480px", width: "640px"}}
                        src="http://localhost:8080/index.html"
                    />
                </div>

                <div className="block">
                    <div className='game-details'>
                        <center>
                        <div className='game-description'>
                            <p dangerouslySetInnerHTML={{ __html: gameData.deck }} />
                        </div>
                        </center>
                    </div>
                </div>
            </div>
        </>
    );
}

export default PlayPage;
