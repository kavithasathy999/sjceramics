import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SearchPopup({ onClose }) {
  const [term, setTerm] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (term.trim()) {
      // Navigate to products catalog page with search query parameter in location state
      navigate('/products', { state: { searchQuery: term.trim() } });
    }
    onClose();
  };

  return (
    <div className="search-popup">
      <div className="color-layer" onClick={onClose} />
      <button className="close-search" onClick={onClose} type="button">
        <span className="flaticon-close" />
      </button>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="search"
            name="search-field"
            value={term}
            onChange={(event) => setTerm(event.target.value)}
            placeholder="Search Here"
            required
          />
          <button className="fa fa-solid fa-magnifying-glass fa-fw" type="submit" aria-label="Search" />
        </div>
      </form>
    </div>
  );
}
