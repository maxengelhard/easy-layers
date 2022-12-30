import React from 'react'
import {Link } from 'react-router-dom';

import logo from '../logo192.png';


const Header = () => {
    return (
    <nav className='menu'>
    <Link to="/"><img src={logo} alt='logo'></img></Link>
      <Link className='view' to="/">Create Layer</Link>
      <Link className='view' to="/layers">Existing Layers</Link>
      <Link className='view' to="/about">About</Link>
    </nav>
)
}

export default Header