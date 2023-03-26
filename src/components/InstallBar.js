import React, { useState, useEffect } from 'react';
import axios from 'axios'

const InstallBar = ({ onResult, selectedRunTime, selectedArchitecture, selectedRegion }) => {
    const [layer, setLayer] = useState('');
    const [version, setVersion] = useState('');
    const [shake, setShake] = useState(false);
  
    const handleChange1 = (event) => {
      setLayer(event.target.value);
    }
  
    const handleChange2 = (event) => {
      setVersion(event.target.value);
    }
  
    const handleSubmit = () => {
        
        if (layer === '') {
            setShake(true)
        }
      else {
        createLayer(layer, version);
      }
    }

    const createLayer = async (layer,version) => {
        const endpoint = `create_layer${selectedRunTime==='python3.9' ? '39' : '38'}${selectedArchitecture==='x86_64' ? 'x86': 'arm'}`
        const api_gateway = `https://api-${selectedRegion}.easylayers.dev/${endpoint}`
        
        onResult('loading')
        
        const create_body = version ? {"library" : layer, "version": version} : {"library" : layer}
        // console.log(JSON.stringify(create_body))
        
        await axios.post(`${api_gateway}`,JSON.stringify(create_body), {timeout: 300000})
        .then(response => {
          const {data} = response
          const message = data.Layer_ARN ? data.Layer_ARN : data 
          onResult(message)
        }).catch(err => console.error(err))
      }

    useEffect(() => {
        if (shake) {
          setTimeout(() => {
            setShake(false);
          }, 1000);
        }
      }, [shake]);
  
    return (
    <div>
      <div className='layer-inputs'>
        <form className='left-column'>
            <div className="input-group">
                <label htmlFor="required-input">Layer (required):</label>
                <input id="version" type="text" required value={layer} onChange={handleChange1} />
            </div>
            <div className="input-group">
                <label htmlFor="optional-input">Version (optional):</label>
                <input id="version" type="text" value={version} onChange={handleChange2}/>
            </div>
        </form>
        <div className='right-column'>
            <div className='command-description'>
            <div>Command that will run:</div>
            <div>pip install {version.length===0 ? layer: `${layer}===${version}`}</div>
        </div>
      </div>
      </div>
      <button className={`submit-button${shake ? ' shake' : ''}`} onClick={handleSubmit}>Submit</button>
      </div>
    );  
};

export default InstallBar;