import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

/* views */
import Home from '../views/Home';
import About from '../views/About';
import ExistingLayers from '../views/ExistingLayers';
import logo from '../logo192.png';

/* componenets */


const MobileMenu = () => {
    const [isExpanded, setIsExpanded] = useState(false);
  
    const toggleMenu = () => {
      setIsExpanded(!isExpanded);
    }

    const HamburgerIcon = () => {
        return (
          <div className="hamburger-icon" onClick={() => toggleMenu()}>
            <div className="line" />
            <div className="line" />
            <div className="line" />
          </div>
        );
      };
  
    return (
      <div className="mobile-menu">
        <HamburgerIcon />
        <ul className={`menu-items ${isExpanded ? 'expanded' : 'collapsed'}`}>
          <li>Menu item 1</li>
          <li>Menu item 2</li>
          <li>Menu item 3</li>
          ...
        </ul>
      </div>
    );
  };
  

const Header = () => {
    return (
    <Router>
    <nav className='menu'>
    <Link to="/"><img src={logo} alt='logo'></img></Link>
      <MobileMenu /> 
      <Link to="/">Create Layer(s)</Link>
      <Link to="/layers">Existing Layers</Link>
      <Link to="/about">About</Link>
    </nav>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/layers" element={<ExistingLayers />} />
    <Route path="/about" element={<About />} />
  </Routes>
</Router>
)
}

export default Header