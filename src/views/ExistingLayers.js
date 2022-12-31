import React,{useState,useEffect} from 'react';


const ExistingLayers = () => {
  
  const api_gateway = 'https://lzxbibmw0l.execute-api.us-east-1.amazonaws.com/Stage/get_layers'

  const [layers,setLayers] = useState(false) 
  
  useEffect(() => {
    const fetchData = async () => {
     await fetch(`${api_gateway}`)
     .then(result => result.json())
     .then(result => {
      const cleanResult = {}
      result.forEach((layer) => {
        const name = layer.LayerName.split('-')[0]
        const versions = layer.LayerName.split('-').slice(1).join('-')
        if (cleanResult[name]) {
          const acum_arr = cleanResult[name]
          acum_arr.push({"version":versions,"data": layer}) 
          cleanResult[name]=acum_arr
        }
        else {
          cleanResult[name]=[{"version":versions,"data": layer}]
        }
      })
      setLayers(cleanResult)
      }  
      )
    }

    fetchData()
  },[])

  return (
      <div>
        <h1>Here are all the layers accross regions</h1>
        <h3>Region: us-east-1</h3>
        <div className='layers-container'>
        {layers ? Object.entries(layers).map((layer,i) => {
          const library = layer[0]
          const library_data = layer[1]
          return (
            <div key={i}>
              <h4>Library: {library}</h4>
              {library_data.map((version,j) => {
                const version_data = version.data
                return (
                  <div key={j}>
                  <p>Library Version: {version.version}</p>
                  <p>Layer ARN: {version_data.LatestMatchingVersion.LayerVersionArn}</p>
              <p>Created Date: {version_data.LatestMatchingVersion.CreatedDate}</p> 
              <p>Compatible Runtimes: {version_data.LatestMatchingVersion.CompatibleRuntimes[0]}</p>
              <p>Compatible Architectures: {JSON.stringify(version_data.LatestMatchingVersion.CompatibleArchitectures)}</p>
              </div>
                )
              })}

              
      
            </div>
          )
          
        })
        
        : null}
        </div>
      </div>
    );
  }

export default ExistingLayers;