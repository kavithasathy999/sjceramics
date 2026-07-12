import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import './TestimonialSlider.css';

import patternBg from '../assets/images/background/pattern-6.png';
import tilesIcon from '../assets/images/icons/tiles.png';
import designIcon from '../assets/images/icons/design.png';
import patternColor from '../assets/images/background/pattern-7.png';

const testimonials = [
  {
    id: 1,
    author: 'Anan Hanona',
    role: 'Interior Expert And Customer',
    text: 'Lorem ipsum dolor sit amet, consec adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam, quis nostrud exercitation ullamco laboris. Integer ac orci vitae neque porttitor efficitur best flooring services',
  },
  {
    id: 2,
    author: 'Mahfuz Riad',
    role: 'Interior Expert And Customer',
    text: 'Lorem ipsum dolor sit amet, consec adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam, quis nostrud exercitation ullamco laboris. Integer ac orci vitae neque porttitor efficitur best flooring services',
  },
  {
    id: 3,
    author: 'Anan Hanona',
    role: 'Interior Expert And Customer',
    text: 'Lorem ipsum dolor sit amet, consec adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam, quis nostrud exercitation ullamco laboris. Integer ac orci vitae neque porttitor efficitur best flooring services',
  },
];

export default function TestimonialSlider() {
  return (
    <section className="testimonial-one">
      <div className="testimonial-one_bg" style={{ backgroundImage: `url(${patternBg})` }} />
      {/* <div className="testimonial-one_icon" style={{ backgroundImage: `url(${tilesIcon})` }} />
      <div className="testimonial-one_icon-two" style={{ backgroundImage: `url(${designIcon})` }} /> */}
      <div className="auto-container">
        <div className="sec-title centered">
          <div className="sec-title_title"><i className="flaticon-wood-1" /> Our Testimonials</div>
          <h2 className="sec-title_heading">What Does The Customer <br /> Have To Say?</h2>
        </div>

        <div className="two-item-carousel swiper-container">
          <Swiper
            modules={[Pagination, Autoplay]}
            loop
            speed={800}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
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
                        <h4>{item.author}</h4>
                        <div className="designation">{item.role}</div>
                      </div>
                      <div className="testimonial-block_one-quote flaticon-left" />
                    </div>
                    <div className="testimonial-block_one-lower">
                      <div className="testimonial-block_one-text">{item.text}</div>
                      <div className="testimonial-block_one-rating">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span className="fa fa-star" key={i} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="two-item-carousel_pagination" />
        </div>
      </div>
    </section>
  );
}
