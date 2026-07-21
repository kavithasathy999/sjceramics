import { useEffect, useState } from 'react';
import {
  getNewArrivalProducts,
  HOME_NEW_ARRIVALS_LIMIT,
} from '../utils/newArrivalsData';
import './BrandsMarquee.css';
import './HomeNewArrivals.css';

export default function HomeNewArrivals() {
  const [upcomingProducts, setUpcomingProducts] = useState([]);

  useEffect(() => {
    let active = true;
    getNewArrivalProducts({ limit: HOME_NEW_ARRIVALS_LIMIT })
      .then((items) => {
        if (active) setUpcomingProducts(items);
      })
      .catch(() => {
        if (active) setUpcomingProducts([]);
      });
    return () => { active = false; };
  }, []);

  if (!upcomingProducts.length) return null;

  return (
    <section className="home-arrivals" aria-labelledby="home-arrivals-title">
      <div className="home-arrivals__container">
        <header className="home-arrivals__header">
          <div className="sec-title centered home-arrivals__title">
            <div className="sec-title_title">
              <i className="flaticon-wood-1" /> Coming to our showroom
            </div>
            <h2 className="sec-title_heading" id="home-arrivals-title">New Arrivals</h2>
          </div>
          <p>
            Preview the latest surfaces, sanitary ware and installation essentials selected for
            contemporary spaces.
          </p>
        </header>

        <div className="home-arrivals__posts">
          {upcomingProducts.map((product) => {
            const displayName = product.name.replace(/^KAG\s+/i, '');

            return (
            <article className="story-post" key={product.id}>
              <img src={product.image} alt={displayName} loading="lazy" />
              <div className="story-post__shade" />
              <div className="story-post__topline">
                <span className="story-post__number home-arrivals__new-badge">
                  <strong>New</strong>
                  <small>Arrival</small>
                </span>
                <span className="story-post__category">{product.category}</span>
              </div>
              <div className="story-post__content">
                <h3>{displayName}</h3>
                <p className="story-post__product">
                  <strong>{product.size}</strong>
                  <span>{product.finish}</span>
                </p>
                <div className="story-post__availability" aria-label={`${displayName} arrival status`}>
                  <span>{product.arrivalStatus}</span>
                  <span>Showroom arrival</span>
                </div>
                <p className="story-post__offer-note">{product.availability}</p>
              </div>
            </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
