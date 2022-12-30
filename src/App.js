import React from 'react'
import Header from './components/Header';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

/*css */
import './App.css';

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


