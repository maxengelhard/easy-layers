import React,{useState,useEffect} from 'react';

import copyLogo from '../copy.png';


const ExistingLayers = () => {
  
  const api_gateway = 'https://q6dgudca9d.execute-api.us-east-1.amazonaws.com/Stage/get_layers'

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
        <h1>Existing AWS Lambda Layers</h1>
        <h3>Region: us-east-1</h3>
            <div className='layers-container'>
            {layers ? Object.entries(layers).map((layer,i) => {
              const library = layer[0]
              const library_data = layer[1]
              return (
                <div key={i}>
                  <h3>{library}</h3>
                  <table className='existing_layers_table'>
                    <thead>
                      <tr>
                        <th className='layer_version'>Version</th>
                        <th className='layer_arn'>ARN</th>
                        {/* <th className='layer_created_date'>Created Date</th> */}
                        <th className='layer_runtimes'>Runtime</th>
                        {/* <th className='layer_architectures'>Architectures</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {library_data.sort((a,b) => {
                          const aComponents = a.version.split('-').map(x => parseInt(x, 10));
                          const bComponents = b.version.split('-').map(x => parseInt(x, 10));

                          for (let i = 0; i < 3; i++) {
                            if (aComponents[i] > bComponents[i]) {
                              return -1;
                            } else if (aComponents[i] < bComponents[i]) {
                              return 1;
                            }
                          }

                          return 0;
                      }).map((version,j) => {
                        const version_data = version.data
                        return (
                          <tr key={j}>
                            <td className='layer_version'>{version.version.replaceAll('-','.')}</td>
                            <td className='layer_arn' onClick={() => {navigator.clipboard.writeText(version_data.LatestMatchingVersion.LayerVersionArn)}}><span>{version_data.LatestMatchingVersion.LayerVersionArn}</span> <img src={copyLogo} alt='copylogo'></img></td>
                            {/* <td className='layer_created_date'>{version_data.LatestMatchingVersion.CreatedDate.substring(0,10)}</td>  */}
                            <td className='layer_runtimes'>{version_data.LatestMatchingVersion.CompatibleRuntimes[0]}</td>
                            {/* <td className='layer_architectures'>{JSON.stringify(version_data.LatestMatchingVersion.CompatibleArchitectures)}</td> */}
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
              </div>
              )
            })
            
            : null}
        </div>
      </div>
    );
  }

export default ExistingLayers;
