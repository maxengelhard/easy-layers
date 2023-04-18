import React,{useState,useEffect} from 'react';
import axios from 'axios'

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

  
  
  useEffect(() => {
    setLayers(false)
    const fetchData = async () => {
    const api_gateway = `https://api-${selectedRegion}.easylayers.dev/query_errors`
     await axios.get(`${api_gateway}`)
     .then(result => {
      const {data} = result
      setLayers(data)
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


  return (
      <div>
        <h1>Layers That Have Thrown Errors When Creating</h1>
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
                      </tr>
                    </thead>
        </table>
            <div className='layers-container'>
            {layers ?
            layers.map((layer,i) => {
              const library = layer.library
              return (
                <div key={i}>
                  <h4>{library}</h4>
                  <table className='existing_layers_table'>
                    <thead>
                      <tr>
                        <th className='layer_version'>Version</th>
                        <th className='layer_runtimes'>Runtime</th>
                        <th className='layer_architectures'>Architecture</th>
                      </tr>
                    </thead>
                    <tbody>
                          <tr key={i+1}>
                            <td className='layer_version'>{layer.version}</td>
                            {/* <td className='layer_created_date'>{version_data.LatestMatchingVersion.CreatedDate.substring(0,10)}</td>  */}
                            <td className='layer_runtimes'>{layer.runtime}</td>
                            <td className='layer_architectures'>{layer.machine}</td>
                          </tr>
                      
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
