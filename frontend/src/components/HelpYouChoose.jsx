import './HelpYouChoose.css';
import catalinaBeige from '../assets/images/resource/products/kag-tiles/catalina-beige.png';
import dominoBlue from '../assets/images/resource/products/kag-tiles/domino-blue.png';

export default function HelpYouChoose() {
  return (
    <section className="help-you-choose" aria-labelledby="help-you-choose-title">
      <div className="help-you-choose_floating-elements" aria-hidden="true">
        <span className="floating-item floating-tile float-tile-cream">
          <img src={catalinaBeige} alt="" />
        </span>
        <span className="floating-item floating-tile float-tile-blue">
          <img src={dominoBlue} alt="" />
        </span>
      </div>
      <div className="auto-container">
        <div className="help-you-choose_card">
          <div className="help-you-choose_icon" aria-hidden="true">
            <svg viewBox="0 0 48 48" focusable="false">
              <path d="M12.5 34.5 7 40l1.8-8.1A17 17 0 1 1 16 38" />
              <path d="M18 20.5a6.2 6.2 0 0 1 12.1 1.8c0 4.7-6.1 4.8-6.1 8.2" />
              <path d="M24 35.5h.01" />
            </svg>
          </div>

          <h2 id="help-you-choose-title" className="help-you-choose_title">
            Confused? I Will Help To Find Out
          </h2>

          <a
            className="help-you-choose_button"
            href="https://wa.me/919384105222"
            target="_blank"
            rel="noreferrer"
            aria-label="Chat with SJ Ceramics on WhatsApp"
          >
            <span className="help-you-choose_whatsapp-icon" aria-hidden="true">
              <i className="fa-brands fa-whatsapp" />
            </span>
            <strong>WhatsApp Now</strong>
            <svg className="help-you-choose_arrow" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
