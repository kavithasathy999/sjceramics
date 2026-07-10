import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

import patternBg from '../assets/images/background/pattern-6.png';
import tilesIcon from '../assets/images/icons/tiles.png';
import designIcon from '../assets/images/icons/design.png';
import patternColor from '../assets/images/background/pattern-7.png';
import patternAuthor from '../assets/images/background/pattern-8.png';
import author1 from '../assets/images/bgimages/review1.jpeg';
import author2 from '../assets/images/bgimages/review2.jpeg';

const testimonials = [
  {
    id: 1,
    author: 'Anan Hanona',
    role: 'Interior Expert And Customer',
    avatar: author1,
    text: 'Lorem ipsum dolor sit amet, consec adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam, quis nostrud exercitation ullamco laboris. Integer ac orci vitae neque porttitor efficitur best flooring services',
  },
  {
    id: 2,
    author: 'Mahfuz Riad',
    role: 'Interior Expert And Customer',
    avatar: author2,
    text: 'Lorem ipsum dolor sit amet, consec adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam, quis nostrud exercitation ullamco laboris. Integer ac orci vitae neque porttitor efficitur best flooring services',
  },
  {
    id: 3,
    author: 'Anan Hanona',
    role: 'Interior Expert And Customer',
    avatar: author1,
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
                    <div className="testimonial-block_one-color" style={{ backgroundImage: `url(${patternColor})` }} />
                    <div className="testimonial-block_one-upper">
                      <div className="testimonial-block_one-author_outer" style={{ backgroundImage: `url(${patternAuthor})`}}>
                        <div className="testimonial-block_one-author">
                          <img src={item.avatar} alt={item.author} style={{borderRadius:"40px"}}/>
                        </div>
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
