import React, { useState , useEffect} from 'react';

const DropdownMenu = ({items, defaultValue, title, onValueChange}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState(items);
  const [filter, setFilter] = useState(defaultValue);
  const [highlightedItem, setHighlightedItem] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    setHighlightedItem(false)
  }

  const handleSearchChange = (event) => {
    const searchTerm = event.target.value;
    setSearchTerm(searchTerm);
    const filteredItems = items.filter(item => item.includes(searchTerm));
    setFilteredItems(filteredItems);
    setHighlightedItem(false)
  }

  const handleItemClick = (item) => {
    onValueChange(item);
    setFilter(item);
    setIsOpen(false);
    setHighlightedItem(false);
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      if (!highlightedItem) {
        const firstItem = filteredItems.length > 0 ? filteredItems[0] : defaultValue; 
        setFilter(firstItem);
        setHighlightedItem(firstItem); 
      } else {
        setIsOpen(false);
        setHighlightedItem(false); 
      }
    }
  }

  useEffect(() => {
    const handleClickOutside = event => {
      if (isOpen && !event.target.closest('.dropdown')) {
        setIsOpen(false);
        setFilteredItems(items)
      }
    };
    document.body.addEventListener('click', handleClickOutside);
    return () => {
      document.body.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen,items]);

  return (
    <div className={`dropdown ${isOpen ? 'show' : ''}`}>
        <div>{title}</div>
        <button onClick={toggleMenu} onKeyDown={handleKeyDown}>{filter}</button>
      <ul className={`dropdown-menu ${isOpen ? 'show' : ''}`}>
        <li className="dropdown-search">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
          />
        </li>
        {filteredItems.map(item => {
            const item_x = item === 'Select all' ? 'All' : item
            return (
          <li className={`dropdown-item ${highlightedItem === item ? 'highlighted' : ''}`} key={item_x} onClick={() => {
            handleItemClick(item_x);
          }}
          onMouseOver={() => setHighlightedItem(item_x)}
          onKeyDown={handleKeyDown}>
            {item}
          </li>
            )
        }
        )}
      </ul>
    </div>
  );
}

export default DropdownMenu;
