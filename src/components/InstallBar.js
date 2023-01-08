import React, { useState, useEffect } from 'react';

const InstallBar = () => {
    const [text1, setText1] = useState('');
    const [text2, setText2] = useState('');
    const [shake, setShake] = useState(false);
  
    const handleChange1 = (event) => {
      setText1(event.target.value);
    }
  
    const handleChange2 = (event) => {
      setText2(event.target.value);
    }
  
    const handleSubmit = () => {
        
        if (text1 === '') {
            setShake(true)
        }
      else {
        console.log(text1, text2);
      }
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
                <input id="version" type="text" required value={text1} onChange={handleChange1} />
            </div>
            <div className="input-group">
                <label htmlFor="optional-input">Version (optional):</label>
                <input id="version" type="text" value={text2} onChange={handleChange2}/>
            </div>
        </form>
        <div className='right-column'>
            <div className='command-description'>
            <div>Command that will run:</div>
            <div>pip install {text2.length===0 ? text1: `${text1}===${text2}`}</div>
        </div>
      </div>
      </div>
      <button className={`submit-button${shake ? ' shake' : ''}`} onClick={handleSubmit}>Submit</button>
      </div>
    );  
};

export default InstallBar;