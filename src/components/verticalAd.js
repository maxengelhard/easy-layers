import React, { useEffect } from 'react';
import scriptjs from 'scriptjs';


const VerticalAd = () => {
    
    useEffect( () => {
    // const script = document.createElement('script');
    // script.async = true;
    // script.src = "//z-na.amazon-adsystem.com/widgets/onejs?MarketPlace=US&adInstanceId=df2357f2-adc7-4060-8268-a6474f63b57d";
    // document.body.appendChild(script);
    scriptjs("//z-na.amazon-adsystem.com/widgets/onejs?MarketPlace=US&adInstanceId=df2357f2-adc7-4060-8268-a6474f63b57d", () => {
      return
    });
    },[])
    
    
    return (
        <div 
        style={{
        //   position: 'fixed',
        //   bottom: 0,
        //   width: '100%',
        //   backgroundColor: '#006699',
          textAlign: 'center',
          padding: '5px',
          margin: 'auto',
          overflowY: 'scroll',
          
        //   height: '15vh',
        //   left: '15%',
        //   display: 'flex',
        //   justifyContent: 'center',
        //   alignItems: 'center'
        }}
        >
          <div style={{ height: '80vh'}} id="amzn-assoc-ad-df2357f2-adc7-4060-8268-a6474f63b57d"></div>
          {/* <div id="amzn-assoc-ad-e5881a3e-6cb6-43e0-bb6e-4f6e4806f9e3"></div> */}
        </div>
    )
} 



export default VerticalAd;

