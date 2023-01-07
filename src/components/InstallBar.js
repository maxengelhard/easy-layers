import React, { useState } from 'react';

const InstallBar = () => {
    const [text1, setText1] = useState('');
    const [text2, setText2] = useState('');
  
    const handleChange1 = (event) => {
      setText1(event.target.value);
    }
  
    const handleChange2 = (event) => {
      setText2(event.target.value);
    }
  
    const handleSubmit = () => {
      console.log(text1, text2);
    }
  
    return (
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
            <button className='submit-button' onClick={handleSubmit}>Submit</button>
        </div>
      </div>
        

      </div>
    );  
};

export default InstallBar;