import { useState } from 'react';

/**
 * Replaces the original `accordion-box` jQuery widget (script.js toggled
 * `.active-block` / `.acc-btn.active` / `.acc-content.current` classes by
 * hand). Only one panel is open at a time, first item open by default -
 * same behaviour as the source markup's `active-block` on item 1.
 */
export default function Accordion({ items }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <ul className="accordion-box">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <li className={`accordion block${isOpen ? ' active-block' : ''}`} key={item.title}>
            <div className="number">{index + 1}</div>
            <div
              className={`acc-btn${isOpen ? ' active' : ''}`}
              role="button"
              tabIndex={0}
              onClick={() => setOpenIndex(isOpen ? -1 : index)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  setOpenIndex(isOpen ? -1 : index);
                }
              }}
            >
              <div className="icon-outer">
                <span className="icon flaticon-arrow-down" />
              </div>
              {item.title}
            </div>
            <div className={`acc-content${isOpen ? ' current' : ''}`} style={{ display: isOpen ? 'block' : 'none' }}>
              <div className="content">
                <p>{item.text}</p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
