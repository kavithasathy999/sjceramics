import React from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

import { posts } from '../utils/BlogData';

export default function BlogSection() {
  return (
    <section className="blog-one">
      <div className="blog-one_bg" style={{ backgroundImage: `url("https://themazine.com/html/fllopi/assets/images/background/5.jpg")` }} />
      <div className="auto-container">
        <div className="sec-title centered">
          <div className="sec-title_title"><i className="flaticon-wood-1" /> Our Blog</div>
          <h2 className="sec-title_heading">Our Latest News <br /> &amp; Articles Post</h2>
        </div>

        <div className="blog-slider-container">
          <Swiper
            modules={[Pagination, Autoplay]}
            loop={true}
            speed={800}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            pagination={{ el: '.blog-slider-pagination', clickable: true }}
            breakpoints={{
              320: {
                slidesPerView: 1.2,
                spaceBetween: 16,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 30,
              }
            }}
            className="blog-swiper"
          >
            {posts.map((post) => (
              <SwiperSlide key={post.id}>
                <div className="blog-card">
                  <div className="blog-card-image-wrap">
                    <img src={post.image} alt={post.title} />
                  </div>
                  <div className="blog-card-content">
                    <h5 className="blog-card-heading">
                      <Link to={`/blog/${post.id}`}>{post.title}</Link>
                    </h5>
                    <p className="blog-card-excerpt">{post.excerpt}</p>
                    <Link to={`/blog/${post.id}`} className="blog-card-readmore">Read More</Link>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          
          <div className="blog-slider-pagination" />
        </div>
      </div>
    </section>
  );
}
