import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Preloader from './components/Preloader';
import ScrollToTop from './components/ScrollToTop';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetails';
import Blogs from './pages/Blogs';
import BlogDetail from './pages/BlogDetail';
import Products from './pages/Products';

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Preloader />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services-details" element={<ServiceDetail />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
        <Route path="/products" element={<Products />} />
      </Routes>
    </BrowserRouter>
  );
}

