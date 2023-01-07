import React , {useState} from 'react';


/* components */
import InstallBar from '../components/InstallBar';
import DropdownMenu from '../components/dropDownMenu';
import regionsJson from '../components/regions'

const Home = () => {
    /* filters */
    const regions = regionsJson['regions'].map((region) => region['attributes']['aws:region']).sort((a,b) => a > b ? 1: -1)
    const [selectedRegion, setselectedRegion] = useState('us-east-1');
    const [selectedRunTime, setselectedRuntime] = useState('python3.9');
    const [selectedArchitecture, setselectedArchitecture] = useState('x86_64');

    const handleRegionChange = (newValue) => {
      setselectedRegion(newValue);
    }
  
    const handleRuntimeChange = (newValue) => {
      setselectedRuntime(newValue);
    }
  
    const handleArchitectureChange = (newValue) => {
      setselectedArchitecture(newValue);
    }
    return (
      <div className='create-layer'>
        <h1 className='title'>Welcome to Easy Layers</h1>
        <h3 className='sub_title'>
        Making AWS layers as easy as pip install
        </h3>
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
    );
  }

export default Home;