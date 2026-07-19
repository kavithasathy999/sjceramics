import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAboutSection } from '../services/aboutSectionApi';
import './AboutSection.css';

export default function AboutSection({ showButton = true }) {
  const videoRef = useRef(null);
  const [content, setContent] = useState({ title: '', description: '', videoUrl: '' });

  useEffect(() => {
    let active = true;
    const loadContent = () => {
      getAboutSection()
        .then((section) => {
          if (active) setContent(section);
        })
        .catch(() => {
          // Dynamic content remains empty until the API becomes available.
        });
    };

    loadContent();
    const refreshTimer = window.setInterval(loadContent, 30000);
    window.addEventListener('focus', loadContent);
    return () => {
      active = false;
      window.clearInterval(refreshTimer);
      window.removeEventListener('focus', loadContent);
    };
  }, []);

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
  }, [content.videoUrl]);

  return (
    <section className="about-one about-company-section">
      <div className="auto-container">
        <div className="about-company-grid">
          <div className="about-company-video-column">
            <div className="about-company-video-shell">
              {content.videoUrl ? (
                <video
                  ref={videoRef}
                  src={content.videoUrl}
                  title={content.title}
                  muted
                  loop
                  playsInline
                  controls
                  preload="metadata"
                />
              ) : <span className="about-company-video-placeholder" aria-hidden="true" />}
            </div>
          </div>

          <div className="about-company-content-column">
            <div className="sec-title about-company-title">
              <div className="sec-title_title"><i className="flaticon-wood-1" /> About us</div>
              <h2 className="sec-title_heading">{content.title}</h2>
              <div className="sec-title_text">{content.description}</div>
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
