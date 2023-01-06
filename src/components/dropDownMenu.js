import React, { useState , useEffect} from 'react';

const DropdownMenu = () => {
  const items = ['us-east-1','us-east-2']
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState(items); // assume items is an array of menu items
  
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
      <button onClick={toggleMenu}>Menu</button>
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
          <li className="dropdown-item" key={item}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DropdownMenu
