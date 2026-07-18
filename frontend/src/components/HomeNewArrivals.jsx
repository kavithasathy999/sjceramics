import { products } from '../utils/ProductData';
import './BrandsMarquee.css';
import './HomeNewArrivals.css';

const upcomingProducts = products.filter((product) => product.isNewArrival).slice(0, 6);

export default function HomeNewArrivals() {
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
                  <span>Coming soon</span>
                  <span>Showroom arrival</span>
                </div>
                <p className="story-post__offer-note">Availability will be announced soon</p>
              </div>
            </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
