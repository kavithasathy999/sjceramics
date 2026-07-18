import React from 'react';

export default function MapLocation() {
  const embedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3890.188500526383!2d80.16309157454452!3d12.831092617944277!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a525995848a4dad%3A0x110e6f17d2b26c6c!2s107%2C%20Mambakkam%20-%20Medavakkam%20Main%20Rd%2C%20Mambakkam%2C%20Tamil%20Nadu%20600127!5e0!3m2!1sen!2sin!4v1784011925910!5m2!1sen!2sin";

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
