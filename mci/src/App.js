import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import HomePage from './components/HomePage';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Search from './components/Search';
import About from './components/About';
import Play from './components/Play';
import Platforms from './components/Platforms';
import Dashboard from './components/Dashboard';
import AboutUs from './components/AboutUs';
import Resources from './components/Resources';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/search" element={<Search />} />
        <Route path="/platforms" element={<Platforms />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/about/:platform/:game" element={<About />} />
        <Route path="/play/:platform/:game" element={<Play />} />
        {/* Add other routes here */}
      </Routes>
    </Router>
  );
}

export default App;
