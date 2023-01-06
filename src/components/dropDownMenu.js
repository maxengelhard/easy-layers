import React, { useState , useEffect} from 'react';
import regions from './regions'

const DropdownMenu = () => {
  const items = regions['regions'].map((region) => region['attributes']['aws:region']).sort((a,b) => a > b ? 1: -1)
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState(items); // assume items is an array of menu items
  const [region,setRegion] = useState('us-east-1')
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  }

  const handleSearchChange = (event) => {
    const searchTerm = event.target.value;
    setSearchTerm(searchTerm);
    const filteredItems = items.filter(item => item.includes(searchTerm));
    setFilteredItems(filteredItems);
  }

  useEffect(() => {
    const handleClickOutside = event => {
      if (isOpen && !event.target.closest('.dropdown')) {
        setIsOpen(false);
      }
    };
    document.body.addEventListener('click', handleClickOutside);
    return () => {
      document.body.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="dropdown">
        <div>Region</div>
        <button onClick={toggleMenu}>{region}</button>
      <ul className={`dropdown-menu ${isOpen ? 'show' : ''}`}>
        <li className="dropdown-search">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </li>
        {filteredItems.map(item => (
          <li className="dropdown-item" key={item} onClick={() => setRegion(item)}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DropdownMenu
