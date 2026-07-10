import React from 'react';

export default function MapLocation() {
  const addressQuery = "107/2A, Medvakkam - Mambakkam Main Road, Mambakkam, Chennai, Tamil Nadu, India - 600127";
  const embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(addressQuery)}&t=&z=16&ie=UTF8&iwloc=&output=embed`;

  return (
    <section className="map-location-section">
      <div className="auto-container">
        <div className="sec-title centered">
          <div className="sec-title_title">
            <i className="flaticon-location-pin" /> Find Us
          </div>
          <h2 className="sec-title_heading">Showroom Location</h2>
          <div className="sec-title_text">
            Visit our showroom to experience our premium tiles and sanitary wares first-hand.
          </div>
        </div>

        <div className="map-container-outer">
          <iframe
            title="SJ Ceramics Location Map"
            src={embedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}
