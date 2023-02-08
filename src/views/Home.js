import React , {useState , useEffect } from 'react';

import copyLogo from '../copy.png';

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
    const [result, setResult] = useState(false);
    


    const handleRegionChange = (newValue) => {
      setselectedRegion(newValue);
    }
  
    const handleRuntimeChange = (newValue) => {
      setselectedRuntime(newValue);
    }
  
    const handleArchitectureChange = (newValue) => {
      setselectedArchitecture(newValue);
    }

    const handleResult = (data) => {
      setResult(data);
    };

   
    useEffect(() => {
      const handleClickOutside = event => {
        if (result!=='loading' && !event.target.closest('.result')) {
          setResult(false);
        }
      };
      document.body.addEventListener('click', handleClickOutside);
      return () => {
        document.body.removeEventListener('click', handleClickOutside);
      };
    }, [result]);

    const display_layer_styles = {
      container: {
        display: "flex",
        alignItems: "center",
        textAlign: "center"
      },
      image: {
        height: "1.25em",
        marginRight: "0.5em",
        width: "1.25em"
      },
      text: {
        fontSize: "1.25em"
      }
    };
    

    

    return (
      <div className='create-layer'>
        <h1 className='title'>Welcome to Easy Layers</h1>
        <h3 className='sub_title'>
        Making AWS layers as easy as pip install
        </h3>
        { !result ? 
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
        <InstallBar onResult={handleResult} selectedRegion={selectedRegion} selectedRunTime={selectedRunTime} selectedArchitecture={selectedArchitecture} />
         
      </div>
      : 
      result === 'loading' ?
      <div className="loading">
              <div className="loading-spinner"></div>
            </div> 
          :
          <div className='completedResult'>
          <div style={display_layer_styles.container} className='result'>
          
          <div style={display_layer_styles.text} className='resulting_layer_arn' onClick={() => {navigator.clipboard.writeText(result)}}>Here's your layer<br></br><br></br><span >{result}</span><img style={display_layer_styles.image} src={copyLogo} alt='copylogo'></img></div>
          
          </div>
          <br></br>
          <br></br>
          <button className='createAnother'>Create Another Layer</button>
          </div>
          }
      {/* <VerticalAd /> */}
          
      </div>
    );
  }

export default Home;
