import { Link } from 'react-router-dom';

/**
 * The banner/breadcrumb strip shown at the top of every interior page
 * (`<section class="page-title">` in the original template).
 */
export default function PageTitle({ title, bgImage, className = '' }) {
  return (
    <section
      className={`page-title${className ? ` ${className}` : ''}`}
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="auto-container">
        <h2>{title}</h2>
        <ul className="bread-crumb clearfix">
          <li><Link to="/">Home</Link></li>
          <li>{title}</li>
        </ul>
      </div>
    </section>
  );
}
