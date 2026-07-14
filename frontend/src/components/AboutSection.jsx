import { Link } from 'react-router-dom';
import './AboutSection.css';

const companyDetails = [
  { label: 'Starting Year', value: '1990' },
  { label: 'Founder', value: 'G. Muralidharan' },
  { label: 'CEO / Managing Director', value: 'G. Muralidharan' },
];

export default function AboutSection({ showButton = true }) {
  return (
    <section className="about-one about-company-section">
      <div className="auto-container">
        <div className="about-company-grid">
          <div className="about-company-video-column">
            <div className="about-company-video-shell">
              <iframe
                src="https://www.youtube-nocookie.com/embed/DPS_YX-YR8E?rel=0"
                title="KAG Tiles brand video"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
            <div className="about-company-video-caption">
              <span className="about-company-video-icon" aria-hidden="true">
                <i className="fa-solid fa-play" />
              </span>
              <div>
                <strong>Experience the KAG story</strong>
                <span>Quality, innovation and inspired spaces</span>
              </div>
            </div>
          </div>

          <div className="about-company-content-column">
            <div className="sec-title about-company-title">
              <div className="sec-title_title"><i className="flaticon-wood-1" /> About us</div>
              <h2 className="sec-title_heading">A Trusted Association with KAG Tiles</h2>
              <div className="sec-title_text">
                SJ Ceramics is an authorized KAG channel partner, bringing premium tiles,
                sanitaryware and bath fittings to customers with dependable guidance and service.
              </div>
            </div>

            <div className="about-company-details" aria-label="KAG company details">
              {companyDetails.map((detail) => (
                <article className="about-company-detail-card" key={detail.label}>
                  <span className="about-company-detail-label">{detail.label}</span>
                  <strong className="about-company-detail-value">{detail.value}</strong>
                </article>
              ))}
            </div>

            {showButton && (
              <div className="about-one_button">
                <Link
                  to="/about"
                  onClick={() => window.scrollTo(0, 0)}
                  className="theme-btn btn-style-one"
                  style={{ borderRadius: '4px', padding: '16px 22px' }}
                >
                  <span className="btn-wrap">
                    <span className="text-one">Read More</span>
                    <span className="text-two">Read More</span>
                  </span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
