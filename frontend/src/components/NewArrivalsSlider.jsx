import { A11y, Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import './NewArrivalsSlider.css';

const formatPrice = (price) => new Intl.NumberFormat('en-IN').format(price);

export default function NewArrivalsSlider({ products, onProductSelect }) {
  if (products.length === 0) return null;

  return (
    <section className="new-arrivals" aria-labelledby="new-arrivals-title">
      <div className="new-arrivals_header">
        <div>
          <span className="new-arrivals_kicker">Fresh from KAG</span>
          <h2 id="new-arrivals-title">New Arrivals</h2>
        </div>
        <div className="new-arrivals_header-aside">
          <div className="new-arrivals_controls" aria-label="New arrival slider controls">
            <button type="button" className="new-arrivals_prev" aria-label="Previous products">
              <i className="fa-solid fa-arrow-left" aria-hidden="true" />
            </button>
            <button type="button" className="new-arrivals_next" aria-label="Next products">
              <i className="fa-solid fa-arrow-right" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <Swiper
        className="new-arrivals_slider"
        modules={[Navigation, A11y]}
        navigation={{
          prevEl: '.new-arrivals_prev',
          nextEl: '.new-arrivals_next',
        }}
        watchOverflow
        spaceBetween={18}
        breakpoints={{
          0: { slidesPerView: 1.12 },
          520: { slidesPerView: 1.75 },
          768: { slidesPerView: 2.45 },
          1100: { slidesPerView: 4 },
        }}
      >
        {products.map((product) => (
          <SwiperSlide key={product.id}>
            <button
              type="button"
              className="new-arrivals_card"
              onClick={() => onProductSelect(product)}
              aria-label={`Enquire about ${product.name}`}
            >
              <span className="new-arrivals_image">
                <img src={product.image} alt={product.name} loading="lazy" />
                <span className="new-arrivals_badge">New</span>
              </span>
              <span className="new-arrivals_content">
                <small>{product.category}</small>
                <strong>{product.name}</strong>
                <span className="new-arrivals_prices">
                  <span>MRP <del>₹{formatPrice(product.mrp)}</del></span>
                  <b>₹{formatPrice(product.offerPrice)}</b>
                </span>
              </span>
            </button>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
