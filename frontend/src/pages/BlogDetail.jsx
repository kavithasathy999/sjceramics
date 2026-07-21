import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BackToTop from '../components/BackToTop';
import PageMeta from '../components/PageMeta';
import { getBlogs } from '../services/blogsApi';
import { generateSlug } from '../utils/slug';

export default function BlogDetail() {
  const { slug } = useParams();
  const [blogPosts, setBlogPosts] = useState([]);

  useEffect(() => {
    let active = true;
    getBlogs().then((items) => { if (active) setBlogPosts(items); }).catch(() => {});
    return () => { active = false; };
  }, []);
  
  const post = blogPosts.find((item) => generateSlug(item.title) === slug);

  if (!post) {
    return (
      <div className="page-wrapper"><Header /><section className="blog-detail-content-section"><div className="auto-container blog-detail-text-wrap"><p className="blogs-empty-message">No blogs are currently available.</p><div className="blog-detail-back-wrapper"><Link to="/blogs" className="blog-detail-back-btn">← Back</Link></div></div></section><Footer /><BackToTop /></div>
    );
  }

  const firstParagraph = post.content[0] || '';
  const firstLetter = firstParagraph.charAt(0);
  const restOfFirstParagraph = firstParagraph.slice(1);

  return (
    <div className="page-wrapper">
      <PageMeta pageKey="blog_detail" />
      <Header />

      {/* Hero Banner with Dark Background Image Overlay */}
      <section 
        className="blog-detail-hero"
        style={post.mediaType === 'video' ? undefined : {
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75)), url(${post.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {post.mediaType === 'video' && <><video className="blog-detail-hero-video" src={post.mediaUrl} controls preload="metadata" /><span className="blog-detail-video-overlay" /></>}
        <div className="auto-container blog-detail-hero-content">
          <span className="blog-detail-badge">{post.category.toUpperCase()}</span>
          <h1 className="blog-detail-title">{post.title}</h1>
          <div className="blog-detail-meta">
            <span className="meta-item">
              <i className="fa fa-user" style={{ marginRight: '6px' }} />
              {post.author}
            </span>
            <span className="meta-item">
              <i className="fa fa-calendar" style={{ marginRight: '6px' }} />
              {post.date}
            </span>
          </div>
        </div>
      </section>

      {/* Detailed Blog Post Text Content */}
      <section className="blog-detail-content-section">
        <div className="auto-container blog-detail-text-wrap">
          {/* First paragraph with Drop-Cap letter */}
          <p className="blog-detail-paragraph">
            <span className="blog-detail-dropcap">{firstLetter}</span>
            {restOfFirstParagraph}
          </p>

          {/* Remaining paragraphs */}
          {post.content.slice(1).map((paragraph, index) => (
            <p key={index} className="blog-detail-paragraph">
              {paragraph}
            </p>
          ))}

          {/* Centered Back Button */}
          <div className="blog-detail-back-wrapper">
            <Link to="/blogs" className="blog-detail-back-btn">
              ← Back
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      <BackToTop />
    </div>
  );
}
