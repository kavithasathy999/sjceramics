require('dotenv').config();

const cors = require('cors');
const express = require('express');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const bannersRoutes = require('./routes/bannersRoutes');
const aboutSectionRoutes = require('./routes/aboutSectionRoutes');
const founderShowcaseRoutes = require('./routes/founderShowcaseRoutes');
const missionVisionRoutes = require('./routes/missionVisionRoutes');
const roomDesignsRoutes = require('./routes/roomDesignsRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const homeOffersRoutes = require('./routes/homeOffersRoutes');
const homeCategoriesRoutes = require('./routes/homeCategoriesRoutes');
const blogsRoutes = require('./routes/blogsRoutes');
const testimonialsRoutes = require('./routes/testimonialsRoutes');
const contactEnquiriesRoutes = require('./routes/contactEnquiriesRoutes');
const exploreCollectionsRoutes = require('./routes/exploreCollectionsRoutes');
const productsRoutes = require('./routes/productsRoutes');
const footerColumnsRoutes = require('./routes/footerColumnsRoutes');
const pageMetaRoutes = require('./routes/pageMetaRoutes');
const enquiriesRoutes = require('./routes/enquiriesRoutes');
const { initializeDatabase } = require('./config/db');

const app = express();
const port = Number(process.env.PORT) || 5000;
const host = '0.0.0.0';
const hostUrl = `http://${host}:${port}`;
const uploadsPath = path.resolve(__dirname, 'uploads');
const frontendPublicPath = path.resolve(__dirname, '..', 'frontend', 'public');
const frontendImagesPath = path.resolve(__dirname, '..', 'frontend', 'src', 'assets', 'images');
fs.mkdirSync(path.join(uploadsPath, 'banners'), { recursive: true });
fs.mkdirSync(path.join(uploadsPath, 'about'), { recursive: true });
fs.mkdirSync(path.join(uploadsPath, 'founder'), { recursive: true });
fs.mkdirSync(path.join(uploadsPath, 'room-designs'), { recursive: true });
fs.mkdirSync(path.join(uploadsPath, 'gallery'), { recursive: true });
fs.mkdirSync(path.join(uploadsPath, 'offers'), { recursive: true });
fs.mkdirSync(path.join(uploadsPath, 'categories'), { recursive: true });
fs.mkdirSync(path.join(uploadsPath, 'blogs'), { recursive: true });
fs.mkdirSync(path.join(uploadsPath, 'products'), { recursive: true });

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim()).filter(Boolean)
  : ['*'];

app.set('trust proxy', true);
// app.use(cors({ origin: allowedOrigins, optionsSuccessStatus: 200 }));
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(uploadsPath));
app.get('/email-assets/sj-logo.png', (_req, res) => res.sendFile(path.join(frontendPublicPath, 'Logo_Png.png')));
app.get('/email-assets/kag-logo.png', (_req, res) => res.sendFile(path.join(frontendImagesPath, 'kaglogo.png')));

app.get('/', (_req, res) => res.json({ success: true, message: 'SJ Ceramics API is running.' }));
app.get('/api/health', (_req, res) => res.json({ success: true, message: 'SJ Ceramics API is running.' }));
app.use('/api/banners', bannersRoutes);
app.use('/api/about-section', aboutSectionRoutes);
app.use('/api/founder-showcase', founderShowcaseRoutes);
app.use('/api/mission-vision', missionVisionRoutes);
app.use('/api/room-designs', roomDesignsRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/home-offers', homeOffersRoutes);
app.use('/api/home-categories', homeCategoriesRoutes);
app.use('/api/blogs', blogsRoutes);
app.use('/api/testimonials', testimonialsRoutes);
app.use('/api/contact-enquiries', contactEnquiriesRoutes);
app.use('/api/explore-collections', exploreCollectionsRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/footer-columns', footerColumnsRoutes);
app.use('/api/page-meta', pageMetaRoutes);
app.use('/page-meta', pageMetaRoutes);
app.use('/api/enquiries', enquiriesRoutes);
app.use((_req, res) => res.status(404).json({ success: false, message: 'Route not found.' }));

app.use((error, _req, res, _next) => {
  if (error instanceof multer.MulterError) {
    const isVideo = error.field === 'video';
    const isBlogMedia = error.field === 'media';
    const isManagedImage = error.field === 'portrait' || error.field === 'image';
    const message = error.code === 'LIMIT_FILE_SIZE'
      ? isBlogMedia ? 'Blog image must be 3 MB or smaller, and video must be 8 MB or smaller.' : isVideo ? 'About video must be 8 MB or smaller.' : isManagedImage ? 'Image must be 3 MB or smaller.' : 'Banner image must be 3 MB or smaller.'
      : isBlogMedia ? 'Upload a JPG, PNG, WebP, MP4, or WebM file.' : isVideo ? 'Upload an MP4 or WebM video.' : 'Upload a JPG, PNG, or WebP image.';
    return res.status(400).json({ success: false, message });
  }
  if (error.code === 'ER_DUP_ENTRY') return res.status(409).json({ success: false, message: 'This sort order is already in use.' });
  console.error(error);
  return res.status(500).json({ success: false, message: 'Internal server error.' });
});

if (require.main === module) {
  initializeDatabase()
    .then(() => app.listen(port, host, () => console.log(`SJ Ceramics API listening on ${hostUrl}`)))
    .catch((error) => {
      console.error('Unable to initialize MySQL:', error.message);
      process.exitCode = 1;
    });
}

module.exports = app;
