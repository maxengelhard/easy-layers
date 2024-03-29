import React, {useState,useEffect} from 'react'
import { BrowserRouter as Router, Routes, Route , Navigate} from 'react-router-dom';

/*css */
import './App.css';

/* components */
import Header from './components/Header';
// import Footer from './components/footer';
import VerticalAd from './components/verticalAd';
import PopupMessage from './components/popupMessage';
// import StripeButton from './components/stripeButton';

/* views */
import Home from './views/Home';
import About from './views/About';
import ExistingLayers from './views/ExistingLayers';
import ExistingErrors from './views/ExistingErrors';

/* regions */
import regionsJson from './components/regions'



function App() {
  const [width, setWidth] = useState(window.innerWidth);
  // const [openStripe, setOpenStripe] = useState(false);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [width]);

  /* listen to websocket */
  const [webhookMessage, setWebhookMessage] = useState('');
  useEffect(() => {
    const regions = regionsJson['regions'].map((region) => region['attributes']['aws:region'])
    regions.forEach(region => {
      const ws = new WebSocket(`wss://wss-${region}.easylayers.dev`);
      
      // ws.addEventListener('open', (event) => {
      //   console.log(`Websocket ${region} connected`)
      // });
      
      ws.addEventListener('message', (event) => {
        const message = event.data;
        // console.log('Received message:', message);
        setWebhookMessage(message);
        // Do something with the message data, e.g. update React state.
      });
      
    })
    
    return
  },[])
  

  
  const handlePopupClose = () => {
      setWebhookMessage('');

  };

  return (
    
   
    <div className="App">
      {webhookMessage && (
        <PopupMessage message={webhookMessage} onClose={handlePopupClose} />
      )}      
       <Router>
      <div className="sidebar">
        <Header />
        {width>=600 ? <div><VerticalAd /> 
        {/* {openStripe ? <StripeButton open={openStripe} /> : <button onClick={() => setOpenStripe(!openStripe)} /> }  */}
        </div> :null }
      </div>
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/layers" element={<ExistingLayers />} />
          <Route path="/about" element={<About />} />
          <Route path="/errors" element={<ExistingErrors />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
      {width<600 ? <div><VerticalAd /> 
      {/* {openStripe ? <StripeButton open={openStripe} /> : <button onClick={() => setOpenStripe(!openStripe)} /> }  */}
      </div> :null } 
      </Router>
      
    </div>
  );
}


export default App;


