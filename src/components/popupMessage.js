import React, { useState, useEffect } from 'react';
import copyLogo from '../copy.png';

const PopupMessage = ({ message, onClose }) => {
  const [visible, setVisible] = useState(true);
  const LayerName = JSON.parse(message).Layer_ARN 
  const version_no_py = LayerName.split('-').slice(0,-2)
  const name = version_no_py.slice(0,-3).join('-').split(':')[6]
  const version = version_no_py.slice(-3).join('-')
  const region = LayerName.split(':')[3] 

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose();
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [onClose]);

  return (
    <div onClick={() => {navigator.clipboard.writeText(LayerName)}} className={`popup-message ${visible ? 'visible' : ''}`}>
      New {region} layer {name} {version.replaceAll('-','.')} 
      <img src={copyLogo} alt='copylogo'></img>
    </div>
  );
};

export default PopupMessage;