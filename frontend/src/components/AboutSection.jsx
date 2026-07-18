import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './AboutSection.css';

export default function AboutSection({ showButton = true }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        video.play().catch(() => {
          // Browsers may still require explicit user interaction to play media.
        });
      } else {
        video.pause();
      }
    }, { threshold: 0.25 });

    observer.observe(video);
    return () => {
      observer.disconnect();
      video.pause();
    };
  }, []);

  return (
    <section className="about-one about-company-section">
      <div className="auto-container">
        <div className="about-company-grid">
          <div className="about-company-video-column">
            <div className="about-company-video-shell">
              <video
                ref={videoRef}
                src="/aboutpagevdo.mp4"
                title="SJ Ceramics company video"
                muted
                loop
                playsInline
                controls
                preload="metadata"
              />
            </div>
            <div className="about-company-video-caption">
              <span className="about-company-video-icon" aria-hidden="true">
                <i className="fa-solid fa-play" />
              </span>
              <div>
                <strong>Experience SJ Ceramics</strong>
                <span>Premium products, expert guidance and elegant spaces</span>
              </div>
            </div>
          </div>

          <div className="about-company-content-column">
            <div className="sec-title about-company-title">
              <div className="sec-title_title"><i className="flaticon-wood-1" /> About us</div>
              <h2 className="sec-title_heading">
                <span className="about-company-title-line">A Trusted Association</span>{' '}
                <span className="about-company-title-line">With KAG Tiles</span>
              </h2>
              <div className="sec-title_text">
                SJ Ceramics is an authorized KAG Channel Partner specializing in the wholesale and
                retail sale of premium tiles, sanitary ware, and bath fittings. We offer a wide range
                of quality products, including floor and wall tiles, vitrified tiles, sanitary ware,
                faucets, and complete bathroom solutions to meet the needs of homeowners, builders,
                architects, and interior designers. With a focus on quality, competitive pricing, and
                excellent customer service, SJ Ceramics is committed to providing reliable products
                and expert guidance to help customers create functional & elegant spaces.
              </div>
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
