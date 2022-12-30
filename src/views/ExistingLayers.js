import React,{useState,useEffect} from 'react';


const ExistingLayers = () => {
  
  const api_gateway = 'https://lzxbibmw0l.execute-api.us-east-1.amazonaws.com/Stage/get_layers'

  const [layers,setLayers] = useState(false) 
  
  useEffect(() => {
    const fetchData = async () => {
     await fetch(`${api_gateway}`)
     .then(result => result.json())
     .then(result => setLayers(result))
    }

    fetchData()
  },[])

  return (
      <div>
        <h1>Here are all the layers accross regions</h1>
        {layers ? layers.map((layer,i) => {
          return (
            <div key={i}>
              <p>Layer Name: {layer.LayerName}</p>
              <p>Layer ARN: {layer.LayerArn}</p>
              <p>Created Date: {layer.LatestMatchingVersion.CreatedDate}</p> 
              <p>Compatible Runtimes: {layer.LatestMatchingVersion.CompatibleRuntimes[0]}</p>
              <p>Compatible Architectures: {JSON.stringify(layer.LatestMatchingVersion.CompatibleArchitectures)}</p>
            </div>
          )
        })
        
        : null}
      </div>
    );
  }

export default ExistingLayers;