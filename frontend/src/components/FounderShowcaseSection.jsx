import { useEffect, useState } from 'react';
import showcaseImage from '../assets/images/about/premium-product-mosaic.jpg';
import { getFounderShowcase } from '../services/aboutSectionApi';
import './FounderShowcaseSection.css';

export default function FounderShowcaseSection() {
  const [portraitUrl, setPortraitUrl] = useState('');

  useEffect(() => {
    let active = true;
    const loadPortrait = () => {
      getFounderShowcase()
        .then((section) => {
          if (active) setPortraitUrl(section.portraitUrl || '');
        })
        .catch(() => {
          // Keep the designed placeholder until the API is available.
        });
    };

    loadPortrait();
    const refreshTimer = window.setInterval(loadPortrait, 30000);
    window.addEventListener('focus', loadPortrait);
    return () => {
      active = false;
      window.clearInterval(refreshTimer);
      window.removeEventListener('focus', loadPortrait);
    };
  }, []);

  return (
    <section className="founder-showcase" aria-label="CEO and Founder showcase">
      <span className="founder-showcase_tile founder-showcase_tile--one" aria-hidden="true" />
      <span className="founder-showcase_tile founder-showcase_tile--two" aria-hidden="true" />
      <span className="founder-showcase_tile founder-showcase_tile--three" aria-hidden="true" />
      <span className="founder-showcase_tile founder-showcase_tile--four" aria-hidden="true" />
      <span className="founder-showcase_tile founder-showcase_tile--five" aria-hidden="true" />
      <span className="founder-showcase_tile founder-showcase_tile--six" aria-hidden="true" />

      <div className="auto-container founder-showcase_container">
        <div className="sec-title centered founder-showcase_header">
          <div className="sec-title_title">
            <i className="flaticon-wood-1" /> Our Leadership
          </div>
          <h2 className="sec-title_heading">Meet Our Founder &amp; CEO</h2>
        </div>

        <div className="founder-showcase_layout">
          <div className="founder-showcase_product">
            <div className="founder-showcase_product-frame">
              <img
                src={showcaseImage}
                alt="Premium tiles, sanitaryware and bath fittings showroom composition"
              />
              <span className="founder-showcase_shine" aria-hidden="true" />
            </div>
          </div>

          <figure className="founder-showcase_founder">
            {portraitUrl ? (
              <div className="founder-showcase_portrait"><img src={portraitUrl} alt="CEO and Founder" /></div>
            ) : (
              <div className="founder-showcase_portrait founder-showcase_portrait--pending" role="img" aria-label="CEO and Founder portrait placeholder" />
            )}
            <figcaption>Founder &amp; CEO</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
