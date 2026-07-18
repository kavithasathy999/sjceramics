import { useEffect, useRef } from 'react';
import './ProductImageModal.css';

export default function ProductImageModal({ product, onClose }) {
  const closeButtonRef = useRef(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className="product-image-modal-overlay" onMouseDown={onClose}>
      <div
        className="product-image-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-image-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          ref={closeButtonRef}
          type="button"
          className="product-image-modal-close"
          aria-label="Close product image"
          onClick={onClose}
        >
          &times;
        </button>
        <div className="product-image-modal-media">
          <img src={product.image} alt={product.name} />
        </div>
        <h2 id="product-image-modal-title">{product.name}</h2>
      </div>
    </div>
  );
}
