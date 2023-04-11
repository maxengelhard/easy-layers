import React,{useState,useEffect} from 'react';
import axios from 'axios'
import copyLogo from '../copy.png';

/* components */
import DropdownMenu from '../components/dropDownMenu';
import regionsJson from '../components/regions'
/* filters */

const ExistingErrors = () => {
  
  const [layers,setLayers] = useState(false)
  /* filters */
  const regions = regionsJson['regions'].map((region) => region['attributes']['aws:region']).sort((a,b) => a > b ? 1: -1)
  const [selectedRegion, setselectedRegion] = useState('us-east-1');
  const [selectedlibrary, setselectedLibrary] = useState('All');
  const [selectedRunTime, setselectedRuntime] = useState('All');
  const [selectedArchitecture, setselectedArchitecture] = useState('All');

  
  
  useEffect(() => {
    setLayers(false)
    const fetchData = async () => {
    const api_gateway = `https://api-${selectedRegion}.easylayers.dev/querry_errors`
     await axios.get(`${api_gateway}`)
     .then(result => {
      const {data} = result
      const cleanResult = {}
      data.forEach((layer) => {
        const version_no_py = layer.LayerName.split('-').slice(0,-2)
        const name = version_no_py.slice(0,-3).join('-')
        const versions = version_no_py.slice(-3).join('-')
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
  },[selectedRegion])



  const handleRegionChange = (newValue) => {
    setselectedRegion(newValue);
  }

  const handleLibraryChange = (newValue) => {
    setselectedLibrary(newValue);
  }

  const handleRuntimeChange = (newValue) => {
    setselectedRuntime(newValue);
  }

  const handleArchitectureChange = (newValue) => {
    setselectedArchitecture(newValue);
  }

  return (
      <div>
        <h1>Existing AWS Lambda Layers</h1>
        <table className='filter_table'>
                    <thead>
                      <tr className='filters'>
                        <th className='region_filter'>
                          <DropdownMenu items={regions} defaultValue={selectedRegion} title={'Region'} 
                          onValueChange={handleRegionChange}/>
                          </th>
                        {layers ? 
                        <th className='library_filter'>
                          <DropdownMenu items={['Select all'].concat(Object.entries(layers).map((layer) => layer[0]))} defaultValue={selectedlibrary} title={'Library'}
                          onValueChange={handleLibraryChange}/>
                          </th>
                        : <th className='library_filter'>Loading...</th> } 
                        <th className='runtime_filter'>
                          <DropdownMenu items={['Select all','python3.9','python3.8']} defaultValue={selectedRunTime} title={'Runtime'}
                          onValueChange={handleRuntimeChange}/>
                          </th>
                        <th className='architecture_filter'><DropdownMenu items={['Select all','x86_64','arm64']} defaultValue={selectedArchitecture} title={'Architecture'}
                        onValueChange={handleArchitectureChange}/>
                        </th>
                      </tr>
                    </thead>
        </table>
            <div className='layers-container'>
            {layers ?
            Object.entries(layers)
            .filter((layer) => (layer[0]===selectedlibrary || selectedlibrary==='All')) // filtering layers
            .filter((layer) => (layer[1].some((version) => {
              return version.data.LatestMatchingVersion.CompatibleRuntimes[0] ===selectedRunTime || selectedRunTime==='All' 
            })))
            .filter((layer) => (layer[1].filter((version) => {
              //console.log(version.data.LatestMatchingVersion.LayerVersionArn ,version.data.LatestMatchingVersion.CompatibleArchitectures ? version.data.LatestMatchingVersion.CompatibleArchitectures : '')
              return (version.data.LatestMatchingVersion.CompatibleArchitectures ? JSON.stringify(version.data.LatestMatchingVersion.CompatibleArchitectures).slice(1,-1).replaceAll('"','') : '') === selectedArchitecture || selectedArchitecture==='All' 
            }
            )).some(version => version))
            .map((layer,i) => {
              const library = layer[0]
              const library_data = layer[1]
              return (
                <div key={i}>
                  <h4>{library}</h4>
                  <table className='existing_layers_table'>
                    <thead>
                      <tr>
                        <th className='layer_version'>Version</th>
                        <th className='layer_arn'>ARN</th>
                        {/* <th className='layer_created_date'>Created Date</th> */}
                        <th className='layer_runtimes'>Runtime</th>
                        <th className='layer_architectures'>Architecture</th>
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
                      })
                      .filter((version) => (version.data.LatestMatchingVersion.CompatibleRuntimes[0] ===selectedRunTime || selectedRunTime==='All'))
                      .filter((version) => (version.data.LatestMatchingVersion.CompatibleArchitectures ? JSON.stringify(version.data.LatestMatchingVersion.CompatibleArchitectures).slice(1,-1).replaceAll('"','') : '') === selectedArchitecture || selectedArchitecture==='All' )
                      .map((version,j) => {
                        const version_data = version.data
                        return (
                          <tr key={j}>
                            <td className='layer_version'>{version.version.replaceAll('-','.')}</td>
                            <td className='layer_arn' onClick={() => {navigator.clipboard.writeText(version_data.LatestMatchingVersion.LayerVersionArn)}}><span>{version_data.LatestMatchingVersion.LayerVersionArn}</span> <img src={copyLogo} alt='copylogo'></img></td>
                            {/* <td className='layer_created_date'>{version_data.LatestMatchingVersion.CreatedDate.substring(0,10)}</td>  */}
                            <td className='layer_runtimes'>{version_data.LatestMatchingVersion.CompatibleRuntimes[0]}</td>
                            <td className='layer_architectures'>{JSON.stringify(version_data.LatestMatchingVersion.CompatibleArchitectures) ? JSON.stringify(version_data.LatestMatchingVersion.CompatibleArchitectures).slice(1,-1).replaceAll('"','') : null}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
              </div>
              )
            })
            :  
            <div className="loading">
              <div className="loading-spinner"></div>
            </div> 
          
            }
        </div>
      </div>
    );
  }

export default ExistingErrors;
