import React,{useState,useEffect} from 'react';


const ExistingLayers = () => {
  
  const [layers,setLayers] = useState(false) 
  
  useEffect(() => {
    setLayers('layers')
  },[])

  return (
      <div>
        <h1>Here are all the layers accross regions</h1>
        {layers ? layers: null}
      </div>
    );
  }

export default ExistingLayers;