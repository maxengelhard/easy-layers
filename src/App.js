import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

/*css */
import './App.css';

/* components */
import Header from './components/Header';
import Footer from './components/Footer';
// import VerticalAd from './components/verticalAd';

/* views */
import Home from './views/Home';
import About from './views/About';
import ExistingLayers from './views/ExistingLayers';


function App() {
  return (
   
    <div className="App">
       <Router>
      <div className="sidebar">
        <Header />
        <Footer />
      </div>
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/layers" element={<ExistingLayers />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
      
      </Router>
      
    </div>
  );
}


export default App;


