import React from 'react'
import {Link } from 'react-router-dom';

import logo from '../logo192.png';


const Header = () => {
    return (
    <nav className='menu'>
    <Link className='logo' to="/"><img src={logo} alt='logo'></img></Link>
      <Link className='view' to="/">Create Layer</Link>
      <Link className='view' to="/layers">Existing Layers</Link>
      <Link className='view' to="/about">About</Link>
      <Link className='view' to="/errors">Unavailable Libraries</Link>
      <a className='view' href="https://patreon.com/MaxEngelhard" target="_blank" rel="noopener noreferrer" style={{color: 'white'}}>
      Sponsor This Project
      </a>
    </nav>
)
}

export default Header