import { useState, useEffect, useRef } from 'react';

export default function SearchableDropdown({
  options = [],
  value = '',
  onChange,
  placeholder = 'Search...',
  disabled = false,
  error = false,
  id,
  name,
  ariaInvalid = false,
  ariaDescribedby
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(value);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef(null);

  // Sync searchTerm with outer value
  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  // Filter options based on search term
  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Reset highlighted index when filter changes
  useEffect(() => {
    setHighlightedIndex(-1);
  }, [searchTerm]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        // Reset search term to current selected value
        setSearchTerm(value);
      }
    }
    document.addEventListener('pointerdown', handleClickOutside, true);
    return () => {
      document.removeEventListener('pointerdown', handleClickOutside, true);
    };
  }, [value]);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    if (!isOpen) {
      setIsOpen(true);
    }
    // Call onChange with empty string if the user cleared or changed the input, 
    // to invalidate until they explicitly pick an option from the list.
    if (onChange && e.target.value !== value) {
      onChange({ target: { name, value: '' } });
    }
  };

  const handleOptionClick = (option) => {
    setSearchTerm(option);
    setIsOpen(false);
    if (onChange) {
      onChange({ target: { name, value: option } });
    }
  };

  const handleKeyDown = (e) => {
    if (disabled) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
      } else {
        setHighlightedIndex(prev => 
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        );
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (isOpen) {
        setHighlightedIndex(prev => (prev > 0 ? prev - 1 : 0));
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (isOpen) {
        if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
          handleOptionClick(filteredOptions[highlightedIndex]);
        } else if (filteredOptions.length === 1) {
          // If only one option is filtered, select it
          handleOptionClick(filteredOptions[0]);
        }
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setSearchTerm(value);
    }
  };

  // Scroll highlighted item into view if necessary
  const listRef = useRef(null);
  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const highlightedEl = listRef.current.children[highlightedIndex];
      if (highlightedEl) {
        highlightedEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex]);

  return (
    <div className="searchable-dropdown-container" ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      <input
        type="text"
        id={id}
        name={name}
        value={searchTerm}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className={error ? 'error' : ''}
        aria-invalid={ariaInvalid}
        aria-describedby={ariaDescribedby}
        autoComplete="off"
        style={{
          width: '100%',
          boxSizing: 'border-box',
          paddingRight: '35px'
        }}
      />
      <span
        className="dropdown-arrow-icon"
        style={{
          position: 'absolute',
          right: '14px',
          top: '50%',
          color: disabled ? '#c1beb9' : '#706b66',
          fontSize: '10px',
          pointerEvents: 'none',
          transition: 'transform 0.2s ease',
          transform: `translateY(-50%) ${isOpen ? 'rotate(180deg)' : ''}`
        }}
      >
        ▼
      </span>
      {isOpen && !disabled && (
        <ul
          ref={listRef}
          className="searchable-dropdown-list"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 9999,
            maxHeight: '200px',
            overflowY: 'auto',
            backgroundColor: '#ffffff',
            border: '1px solid #dcdad5',
            borderRadius: '6px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            listStyle: 'none',
            padding: 0,
            margin: '4px 0 0 0'
          }}
        >
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <li
                key={option}
                onClick={() => handleOptionClick(option)}
                className={`searchable-dropdown-option ${
                  index === highlightedIndex ? 'highlighted' : ''
                } ${option === value ? 'selected' : ''}`}
                style={{
                  padding: '10px 14px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  backgroundColor: option === value ? 'rgba(221, 35, 40, 0.1)' : index === highlightedIndex ? '#f5f4f2' : 'transparent',
                  color: option === value ? '#dd2328' : '#231f1c',
                  fontWeight: option === value ? '600' : 'normal',
                  transition: 'background-color 0.1s'
                }}
              >
                {option}
              </li>
            ))
          ) : (
            <li
              style={{
                padding: '10px 14px',
                color: '#888888',
                fontSize: '14px',
                textAlign: 'center'
              }}
            >
              No results found
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
