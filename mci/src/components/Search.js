import React from 'react';
import { Link, useNavigate } from 'react-router-dom';  
import MCIRetroVaultImage from '../img/MCIRetro_Vault.png';
import AuthService from '../services/AuthService'; // importing AuthService
import { useState, useEffect } from 'react';
import $ from 'jquery';

function Search() {
    const navigate = useNavigate();
    const safeParse = (data) => {
        try {
            return JSON.parse(data);
        } catch (e) {
            return null;
        }
    };
    const user = safeParse(localStorage.getItem('user'));

    const handleLogout = () => {
        AuthService.logout();
        navigate('/search');
    };

    const [gameName, setGameName] = useState('');


    const [platformName, setPlatformName] = useState("");
    const [platformID, setPlatformID] = useState(0);

    const [gameData, setGameData] = useState([]);

    const handleNameChange = (e) => {
        setGameName(e.target.value);
    };

    const handlePlatformChange = (e) => {

        setPlatformName(e.target.value);

        // Giant Bomb ID's for game consoles: update list if adding more consoles!
        const Arcade = 84;
        const a2600 = 40;
        const a5200 = 67;
        const a7800 = 70;
        const NES = 21;
        const SNES = 9;
        const N64 = 43;
        const GB = 3;
        const GBC = 57;
        const VB = 79;
        const GBA = 4;
        const MasterSystem = 8;
        const Genesis = 6;
        const GameGear = 5;
        const PS1 = 22;

        var ID;
        switch(e.target.value){
            case "Arcade": ID = Arcade; break;
            case "2600": ID = a2600; break;
            case "5200": ID = a5200; break;
            case "7800": ID = a7800; break;
            case "NES": ID = NES; break;
            case "SNES": ID = SNES; break;
            case "N64": ID = N64; break;
            case "GB": ID = GB; break;
            case "GBC": ID = GBC; break;
            case "VB": ID = VB; break;
            case "GBA": ID = GBA; break;
            case "MasterSystem": ID = MasterSystem; break;
            case "Genesis": ID = Genesis; break;
            case "GameGear": ID = GameGear; break;
            case "PS1": ID = PS1; break;
            default: ID = 0; break;
        }

        setPlatformID(ID);
        
    };

    useEffect(() => {
        if(gameName.length >= 2 && platformID !== 0){
            $.ajax({
                url: `http://127.0.0.1:5000/search_games`, // Point to your Flask route
                dataType: "json", // Expect JSON data
                data: {
                    gameName: gameName,
                    platformID: platformID
                },
                success: function(res) {
                    setGameData(res);
                    console.log(res);
                },
                error: function(error) {
                    // Handle errors here
                    console.log(error);
                }
            });
        }
        else{
            setGameData([]);
        }
    }, [gameName, platformID]);
    
      function checkEmptyResults() {
        if(gameData.length === 0 && gameName.length > 0){
          return (<h2> <strong> No results found. </strong> </h2>)
        }
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
                        {user ? (
                            <>
                                <button onClick={handleLogout} className="header-button">Logout</button>
                                {/* Add more user-specific links or information here */}
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
        <main>
            <center>

            <div class="block">
            <br/> <label htmlFor="myInput"> What game are you looking for? </label> <br/>
            </div>
            <div class="block">
            <input type="text" id="name" name="name" value={gameName} onChange={handleNameChange} /> <br/>
            </div>
            
            <div class="block">
            <label for="platforms"> Choose a platform: </label> <br/>
            </div>
            <div class="block">
            <select name="platforms" id="platforms" value={platformName} onChange={handlePlatformChange}>
            <option value="choose">Choose a platform...</option>
            <option value="Arcade">Arcade</option>
            <option value="2600">Atari 2600</option>
            <option value="5200">Atari 5200</option>
            <option value="7800">Atari 7800</option>
            <option value="NES">NES</option>
            <option value="SNES">SNES</option>
            <option value="N64">N64</option>
            <option value="GB">Game Boy</option>
            <option value="GBC">Game Boy Color</option>
            <option value="VB">Virtual Boy</option>
            <option value="GBA">Game Boy Advance</option>
            <option value="MasterSystem">Master System</option>
            <option value="Genesis">Genesis</option>
            <option value="GameGear">Game Gear</option>
            <option value="PS1">PlayStation</option>
            </select> <br/>
            </div>

            </center>

        </main>

        <body>
            <center>

                <div class="block">
                { checkEmptyResults() }
                </div>

                { gameData.map((game) => {

                    return(
                
                    <div class="flex-container">
                        <div class='card'> 
                        <Link to={`/about/${ platformID }/${ game.id }`}>
                            <img src={ game.image.icon_url }/>
                            <div class="item">
                                <h4><b> { game.name } </b></h4>
                            </div>
                        </Link>
                        </div>
                    
                    </div>

                    )

                })}

            </center>
        </body>

        </>
    );
}

export default Search;