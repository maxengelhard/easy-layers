import React , {useState} from 'react';


/* components */
import InstallBar from '../components/InstallBar';
import DropdownMenu from '../components/dropDownMenu';
import regionsJson from '../components/regions'
// import VerticalAd from '../components/verticalAd';

const Home = () => {
    /* filters */
    const regions = regionsJson['regions'].map((region) => region['attributes']['aws:region']).sort((a,b) => a > b ? 1: -1)
    const [selectedRegion, setselectedRegion] = useState('us-east-1');
    const [selectedRunTime, setselectedRuntime] = useState('python3.9');
    const [selectedArchitecture, setselectedArchitecture] = useState('x86_64');
//     const [createdLayer,setCreatedLayer] = useState(false)

    const handleRegionChange = (newValue) => {
      setselectedRegion(newValue);
    }
  
    const handleRuntimeChange = (newValue) => {
      setselectedRuntime(newValue);
    }
  
    const handleArchitectureChange = (newValue) => {
      setselectedArchitecture(newValue);
    }

//     const createLayer = async () => {
//       const endpoint = `create_layer${selectedRunTime==='python3.9' ? '39' : '38'}${selectedArchitecture==='x86_64' ? 'x86': 'arm'}`
//       const api_gateway = `https://api-${selectedRegion}.easylayers.dev/${endpoint}`
//       await fetch(`${api_gateway}`)
//       .then(result => result.json())
//       .then(result => setCreatedLayer(result))
//     }

    return (
      <div className='create-layer'>
        <h1 className='title'>Welcome to Easy Layers</h1>
        <h3 className='sub_title'>
        Making AWS layers as easy as pip install
        </h3>
        <div className='make-a-layer'>
        <table className='set_conditions_home'>
          <caption>Select Your Conditions</caption>
                    <thead>
                      <tr className='filters'>
                        <th className='region_filter'>
                          <DropdownMenu items={regions} defaultValue={selectedRegion} title={'Region'} 
                          onValueChange={handleRegionChange}/>
                          </th>
                        <th className='runtime_filter'>
                          <DropdownMenu items={['python3.9','python3.8']} defaultValue={selectedRunTime} title={'Runtime'}
                          onValueChange={handleRuntimeChange}/>
                          </th>
                        <th className='architecture_filter'><DropdownMenu items={['x86_64','arm64']} defaultValue={selectedArchitecture} title={'Architecture'}
                        onValueChange={handleArchitectureChange}/>
                        </th>
                      </tr>
                    </thead>
        </table>
        <InstallBar />
      </div>
      {/* <VerticalAd /> */}
      </div>
    );
  }

export default Home;
