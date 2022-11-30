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
        <div className='affiliate'>
          <div className='affiliateRender'  id="amzn-assoc-ad-df2357f2-adc7-4060-8268-a6474f63b57d"></div>
          {/* <div id="amzn-assoc-ad-e5881a3e-6cb6-43e0-bb6e-4f6e4806f9e3"></div> */}
        </div>
    )
} 



export default VerticalAd;

