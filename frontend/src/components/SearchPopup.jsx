import { useState } from 'react';

export default function SearchPopup({ onClose }) {
  const [term, setTerm] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // In the original template this posted to blog.html; here we just
    // close the popup since there's no search backend wired up yet.
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
