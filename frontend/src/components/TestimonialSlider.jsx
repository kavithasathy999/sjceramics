import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import './TestimonialSlider.css';

import patternBg from '../assets/images/background/pattern-6.png';
import { getTestimonials } from '../services/testimonialsApi';

export default function TestimonialSlider() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let active = true;
    getTestimonials()
      .then((items) => { if (active) setTestimonials(items); })
      .catch(() => { if (active) setLoadError(true); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  return (
    <section className="testimonial-one">
      <div className="testimonial-one_bg" style={{ backgroundImage: `url(${patternBg})` }} />
      <div className="auto-container">
        <div className="sec-title centered">
          <div className="sec-title_title"><i className="flaticon-wood-1" /> Our Testimonials</div>
          <h2 className="sec-title_heading">What Does The Customer <br /> Have To Say?</h2>
        </div>

        <div className="two-item-carousel swiper-container">
          {!loading && !loadError && testimonials.length > 0 ? <Swiper
            key={testimonials.length}
            modules={[Pagination, Autoplay]}
            loop={testimonials.length > 1}
            speed={800}
            autoplay={testimonials.length > 1 ? { delay: 5000, disableOnInteraction: false } : false}
            pagination={{ el: '.two-item-carousel_pagination', clickable: true }}
            spaceBetween={30}
            slidesPerView={1}
            breakpoints={{ 768: { slidesPerView: 2 } }}
          >
            {testimonials.map((item) => (
              <SwiperSlide key={item.id}>
                <div className="testimonial-block_one">
                  <div className="testimonial-block_one-inner">
                    <div className="testimonial-block_one-upper testimonial-block_one-upper--with-icon">
                      <div className="testimonial-customer-icon" aria-hidden="true">
                        <svg viewBox="0 0 48 48" fill="none">
                          <circle cx="24" cy="18" r="7" />
                          <path d="M11.5 38c1.7-7.1 6.2-10.7 12.5-10.7S34.8 30.9 36.5 38" />
                          <path d="M37.5 11.5h4v4" />
                          <path d="M41.5 11.5 35 18" />
                        </svg>
                      </div>
                      <div className="testimonial-block_one-author_content">
                        <h4>{item.customerName}</h4>
                        <div className="designation">{item.designation}</div>
                      </div>
                      <div className="testimonial-block_one-quote flaticon-left" />
                    </div>
                    <div className="testimonial-block_one-lower">
                      <div className="testimonial-block_one-text" style={{ textAlign: 'justify' }}>{item.description}</div>
                      <div className="testimonial-block_one-rating" aria-label={`${item.starRating} out of 5 stars`}>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span className={`fa fa-star${i < item.starRating ? '' : ' is-empty'}`} aria-hidden="true" key={i} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper> : <div className="testimonial-slider-status">{loading ? 'Loading testimonials...' : loadError ? 'Testimonials are temporarily unavailable.' : 'No testimonials available.'}</div>}

          {testimonials.length > 1 && !loadError && <div className="two-item-carousel_pagination" />}
        </div>
      </div>
    </section>
  );
}
