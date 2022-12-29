import React from 'react';


/* components */
import InstallBar from '../components/InstallBar';


const Home = () => {
    return (
      <div className='create-layer'>
        <h1>Welcome to Easy Layers</h1>
        <h3>
        Making AWS layers as easy as pip install
        </h3>
        <InstallBar />
      </div>
    );
  }

export default Home;