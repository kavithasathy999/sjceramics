import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BackToTop from '../components/BackToTop';
import PageMeta from '../components/PageMeta';
import { getBlogs } from '../services/blogsApi';
import { generateSlug } from '../utils/slug';
import bannerBg from '../assets/images/background/blogs_banner_bg.png';
import './Blogs.css';

export default function Blogs() {
  const [blogPosts, setBlogPosts] = useState([]);

  useEffect(() => {
    let active = true;
    getBlogs().then((items) => { if (active) setBlogPosts(items); }).catch(() => {});
    return () => { active = false; };
  }, []);

  return (
    <div className="page-wrapper blogs-page-wrapper">
      <PageMeta pageKey="blogs" />
      <Header />

      {/* Standardized Marble Page Title Banner */}
      <section className="page-title" style={{ backgroundImage: `url(${bannerBg})` }}>
        <div className="auto-container">
          <h2 style={{ color: "#000000" }}>Blogs</h2>
          <ul className="bread-crumb clearfix">
            <li><Link to="/" style={{ color: "#000000" }}>Home</Link></li>
            <li>Blogs</li>
          </ul>
        </div>
      </section>

      {/* Blogs Articles Listing Section */}
      <section className="blogs-listing-section">
        <div className="auto-container">
          <div className="blogs-section-header">
            <h2 className="blogs-section-main-title">BLOGS &amp; ARTICLES</h2>
            <div className="blogs-section-divider" />
          </div>

          <div className="blogs-grid">
            {blogPosts.map((post) => (
              <div className="blog-card" key={post.id}>
                <div className="blog-card-image-wrap">
                  {post.mediaType === 'video'
                    ? <video src={post.mediaUrl} controls preload="metadata" aria-label={`${post.title} video`} />
                    : <img src={post.mediaUrl || post.image} alt={post.title} />}
                </div>
                <div className="blog-card-content">
                  <h5 className="blog-card-heading">
                    <Link to={`/blog/${generateSlug(post.title)}`}>{post.title}</Link>
                  </h5>
                  <p className="blog-card-excerpt">{post.excerpt}</p>
                  <Link to={`/blog/${generateSlug(post.title)}`} className="blog-card-readmore">Read More</Link>
                </div>
              </div>
            ))}
            {!blogPosts.length && <p className="blogs-empty-message">No blogs are currently available.</p>}
          </div>
        </div>
      </section>

      <Footer />
      <BackToTop />
    </div>
  );
}
