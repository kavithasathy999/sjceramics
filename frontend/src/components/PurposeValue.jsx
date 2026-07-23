import { useEffect, useState } from 'react';
import { FaBullseye, FaEye } from 'react-icons/fa';
import { getMissionVision } from '../services/aboutSectionApi';
import './PurposeValue.css';

const DEFAULT_DATA = {
  headerBadge: '',
  headerTitle: '',
  headerDescription: '',
  missionTag: '',
  missionTitle: '',
  missionDescription: '',
  missionBadges: [],
  visionTag: '',
  visionTitle: '',
  visionDescription: '',
  visionBadges: [],
};

export default function PurposeValue() {
  const [data, setData] = useState(DEFAULT_DATA);

  useEffect(() => {
    let active = true;
    getMissionVision()
      .then((res) => {
        if (active && res) {
          setData({
            headerBadge: res.headerBadge || '',
            headerTitle: res.headerTitle || '',
            headerDescription: res.headerDescription || '',
            missionTag: res.missionTag || '',
            missionTitle: res.missionTitle || '',
            missionDescription: res.missionDescription || '',
            missionBadges: Array.isArray(res.missionBadges) ? res.missionBadges : [],
            visionTag: res.visionTag || '',
            visionTitle: res.visionTitle || '',
            visionDescription: res.visionDescription || '',
            visionBadges: Array.isArray(res.visionBadges) ? res.visionBadges : [],
          });
        }
      })
      .catch(() => {
        // Keep DEFAULT_DATA on error
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="purpose-value-section">
      <div className="purpose-value-decor-left" aria-hidden="true" />
      <div className="purpose-value-decor-right" aria-hidden="true" />
      
      <div className="auto-container">
        <div className="sec-title centered">
          <div className="sec-title_title">
            <i className="flaticon-wood-1" /> {data.headerBadge}
          </div>
          <h2 className="sec-title_heading">{data.headerTitle}</h2>
          <div className="sec-title_text">
            {data.headerDescription}
          </div>
        </div>

        <div className="row clearfix">
          {/* Purpose Block */}
          <div className="purpose-block purpose-block--mission col-lg-6 col-md-6 col-sm-12">
            <div className="purpose-block_inner">
              <div className="purpose-card-border-glow" />
              <span className="purpose-tag">{data.missionTag}</span>
              <div className="purpose-block_icon">
                <FaBullseye aria-hidden="true" />
              </div>
              <h3 className="purpose-block_title">{data.missionTitle}</h3>
              <p className="purpose-block_text">
                {data.missionDescription}
              </p>
              <div className="purpose-badges-container">
                {data.missionBadges.map((badge, idx) => (
                  <span className="purpose-badge-pill" key={idx}>{badge}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Value Block */}
          <div className="purpose-block purpose-block--vision col-lg-6 col-md-6 col-sm-12">
            <div className="purpose-block_inner">
              <div className="purpose-card-border-glow" />
              <span className="purpose-tag">{data.visionTag}</span>
              <div className="purpose-block_icon">
                <FaEye aria-hidden="true" />
              </div>
              <h3 className="purpose-block_title">{data.visionTitle}</h3>
              <p className="purpose-block_text">
                {data.visionDescription}
              </p>
              <div className="purpose-badges-container">
                {data.visionBadges.map((badge, idx) => (
                  <span className="purpose-badge-pill" key={idx}>{badge}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
