import { FaBullseye, FaEye } from 'react-icons/fa';
import './PurposeValue.css';

export default function PurposeValue() {
  return (
    <section className="purpose-value-section">
      <div className="purpose-value-decor-left" aria-hidden="true" />
      <div className="purpose-value-decor-right" aria-hidden="true" />
      
      <div className="auto-container">
        <div className="sec-title centered">
          <div className="sec-title_title">
            <i className="flaticon-wood-1" /> Core Foundation
          </div>
          <h2 className="sec-title_heading">Our Mission &amp; Vision</h2>
          <div className="sec-title_text">
            Guiding our commitment to quality, trust, and craftsmanship in every tile and sanitary ware we deliver.
          </div>
        </div>

        <div className="row clearfix">
          {/* Purpose Block */}
          <div className="purpose-block purpose-block--mission col-lg-6 col-md-6 col-sm-12">
            <div className="purpose-block_inner">
              <div className="purpose-card-border-glow" />
              <span className="purpose-tag">VISIONARY DESIGN</span>
              <div className="purpose-block_icon">
                <FaBullseye aria-hidden="true" />
              </div>
              <h3 className="purpose-block_title">Our Purpose</h3>
              <p className="purpose-block_text">
                To shape inspiring environments by delivering the finest top-tier tiles sanitary wares, and premium bath fitting that seamlessly integrate beauty, longevity, and everyday luxury.
              </p>
              <div className="purpose-badges-container">
                <span className="purpose-badge-pill">Luxury Living</span>
                <span className="purpose-badge-pill">Uncompromising Quality</span>
                <span className="purpose-badge-pill">Premium Materials</span>
              </div>
            </div>
          </div>

          {/* Value Block */}
          <div className="purpose-block purpose-block--vision col-lg-6 col-md-6 col-sm-12">
            <div className="purpose-block_inner">
              <div className="purpose-card-border-glow" />
              <span className="purpose-tag">CLIENT CENTRICITY</span>
              <div className="purpose-block_icon">
                <FaEye aria-hidden="true" />
              </div>
              <h3 className="purpose-block_title">Our Values</h3>
              <p className="purpose-block_text">
                SJ Ceramics' vision of becoming a trusted destination for premium building materials while complementing KAG's focus on quality, innovation, ethical values, and customer satisfaction.
              </p>
              <div className="purpose-badges-container">
                <span className="purpose-badge-pill">KAG Partnership</span>
                <span className="purpose-badge-pill">Absolute Integrity</span>
                <span className="purpose-badge-pill">Lifetime Trust</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
