import React, {useState,useEffect} from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

/*css */
import './App.css';

/* components */
import Header from './components/Header';
// import Footer from './components/footer';
import VerticalAd from './components/verticalAd';

/* views */
import Home from './views/Home';
import About from './views/About';
import ExistingLayers from './views/ExistingLayers';


function App() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    
   
    <div className="App">
       <Router>
      <div className="sidebar">
        <Header />
        {width>=600 ? <VerticalAd /> :null }
      </div>
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/layers" element={<ExistingLayers />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
      {width<600 ? <VerticalAd /> :null } 
      </Router>
      
    </div>
  );
}


export default App;


