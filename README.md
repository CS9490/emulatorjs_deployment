# MCI RetroVault

![MCI RetroVault](/mci/src/img/MCIRetro_Vault.png)

## About

MCIRetroVault is a website where people can learn about and play retro video games, all in one place. Users can read facts and trivia about retro video games and consoles, and then play them directly in their browser.

## Technologies

* Giant Bomb API for game data
* React for main website
* Flask for main server
* ExpressJS for EmulatorJS server

## How to run

1. Make sure you have Node installed on your system.
2. You can run the Flask server by navigating to the folder `server` and running `python app.py` in your terminal. The server will be running locally on `localhost:5000`.
3. You can run the main website by navigating to the folder `mci` and running `npm start` in your terminal. The website will be running locally on `localhost:3000`.
4. In order to use the Giant Bomb API, you must include a virtual environment file in the same directory as `app.py`, that contains the text `GIANT_BOMB_API_KEY=[your API key]`.
5. You can run the EmulatorJS webserver by navigating to the `games` folder and running `node server.js` in your terminal. The server will be running locally on `localhost:8080`.
6. You're ready to explore our application!

## Main features

* On the Platforms page, you can find information about the game consoles hosted on the website.
* On the Search page, you can search for games using the game's title and the game's platform.
* Clicking on a game from the search page will lead to the About page, which displays information about the game, and presents the viewer with the ability to play and/or favorite the game.
* If the user chooses to play the game, they will be sent to the Play page, where they can play the game in their browser via EmulatorJS.
* Users can view games they've favorited in the Dashboard page.


## Side Note
Testing for API; Unit; Integration is complete. Run Pytest in the venv to confirm the API works as intended 

##

This website was made by:
* Miguel Luna
* Cristian Statescu
* Ishtiaq Khan  

Prof. Donato M. Cruz  
CCNY - CSc 47300: Website Design - Fall 2023  
