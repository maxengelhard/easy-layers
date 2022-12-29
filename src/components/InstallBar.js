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
        <div className='text-input'>
            Layer (required)
            <input type="text" value={text1} onChange={handleChange1} />
        </div>
        <div className='text-input'>
            Version (optional)
            <input type="text" value={text2} onChange={handleChange2} />
        </div>
            <div className='command-description'>
            <div>Command that will run:</div>
            <div>pip install {text2.length===0 ? text1: `${text1}===${text2}`}</div>
            </div>
        <button className='submit-button' onClick={handleSubmit}>Submit</button>
      </div>
    );  
};

export default InstallBar;