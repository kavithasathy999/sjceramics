const mysql = require('mysql2/promise');
const blogSeed = require('./blogSeed');
const exploreCollectionsSeed = require('./exploreCollectionsSeed');
const productsSeed = require('./productsSeed');
const footerSeed = require('./footerSeed');
const fs = require('fs');
const path = require('path');

const databaseName = process.env.DB_NAME || 'sj_ceramics';
if (!/^[A-Za-z0-9_]+$/.test(databaseName)) throw new Error('DB_NAME contains unsupported characters.');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: databaseName,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const initializeDatabase = async () => {
  const bootstrapConnection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
  });
  await bootstrapConnection.query(`CREATE DATABASE IF NOT EXISTS \`${databaseName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
  await bootstrapConnection.end();

  await pool.query(`
    CREATE TABLE IF NOT EXISTS banners (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      title VARCHAR(150) NOT NULL,
      description VARCHAR(500) NOT NULL,
      image VARCHAR(255) NULL,
      placement VARCHAR(50) NOT NULL DEFAULT 'Home hero',
      sort_order INT UNSIGNED NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY banners_sort_order_unique (sort_order)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await pool.query(`
    UPDATE banners
    SET image = CONCAT('uploads/banners/', image)
    WHERE image IS NOT NULL
      AND image <> ''
      AND image NOT LIKE 'uploads/banners/%'
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS about_section (
      id TINYINT UNSIGNED NOT NULL,
      title VARCHAR(180) NOT NULL,
      description TEXT NOT NULL,
      video VARCHAR(255) NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await pool.query(
    `INSERT IGNORE INTO about_section (id, title, description, video)
     VALUES (1, ?, ?, ?)`,
    [
      'A Trusted Association With KAG Tiles',
      'SJ Ceramics is an authorized KAG Channel Partner specializing in the wholesale and retail sale of premium tiles, sanitary ware, and bath fittings. We offer a wide range of quality products, including floor and wall tiles, vitrified tiles, sanitary ware, faucets, and complete bathroom solutions to meet the needs of homeowners, builders, architects, and interior designers. With a focus on quality, competitive pricing, and excellent customer service, SJ Ceramics is committed to providing reliable products and expert guidance to help customers create functional and elegant spaces.',
      'uploads/about/aboutpagevdo.mp4',
    ],
  );

  await pool.query(`
    CREATE TABLE IF NOT EXISTS founder_showcase (
      id TINYINT UNSIGNED NOT NULL,
      portrait VARCHAR(255) NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
  await pool.query('INSERT IGNORE INTO founder_showcase (id, portrait) VALUES (1, NULL)');

  await pool.query(`
    CREATE TABLE IF NOT EXISTS mission_vision (
      id TINYINT UNSIGNED NOT NULL,
      header_badge VARCHAR(100) NOT NULL,
      header_title VARCHAR(150) NOT NULL,
      header_description TEXT NOT NULL,
      mission_tag VARCHAR(100) NOT NULL,
      mission_title VARCHAR(100) NOT NULL,
      mission_description TEXT NOT NULL,
      mission_badges TEXT NOT NULL,
      vision_tag VARCHAR(100) NOT NULL,
      vision_title VARCHAR(100) NOT NULL,
      vision_description TEXT NOT NULL,
      vision_badges TEXT NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await pool.query(
    `INSERT IGNORE INTO mission_vision (
      id, header_badge, header_title, header_description,
      mission_tag, mission_title, mission_description, mission_badges,
      vision_tag, vision_title, vision_description, vision_badges
    ) VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      'Core Foundation',
      'Our Mission & Vision',
      'Guiding our commitment to quality, trust, and craftsmanship in every tile and sanitary ware we deliver.',
      'VISIONARY DESIGN',
      'Mission',
      'To shape inspiring environments by delivering the finest top-tier tiles sanitary wares, and premium bath fitting that seamlessly integrate beauty, longevity, and everyday luxury.',
      JSON.stringify(['Luxury Living', 'Uncompromising Quality', 'Premium Materials']),
      'CLIENT CENTRICITY',
      'Vision',
      "SJ Ceramics' vision of becoming a trusted destination for premium building materials while complementing KAG's focus on quality, innovation, ethical values, and customer satisfaction.",
      JSON.stringify(['KAG Partnership', 'Absolute Integrity', 'Lifetime Trust']),
    ],
  );

  await pool.query(`
    CREATE TABLE IF NOT EXISTS room_designs (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      title VARCHAR(100) NOT NULL,
      image VARCHAR(255) NOT NULL,
      applications TEXT NOT NULL,
      sort_order INT UNSIGNED NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY room_designs_sort_order_unique (sort_order)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  const [[{ roomDesignCount }]] = await pool.query('SELECT COUNT(*) AS roomDesignCount FROM room_designs');
  if (Number(roomDesignCount) === 0) {
    await pool.query(
      `INSERT INTO room_designs (title, image, applications, sort_order) VALUES
       (?, 'uploads/room-designs/room-designs.jpeg', ?, 1),
       (?, 'uploads/room-designs/bathroom-designs.jpeg', ?, 2),
       (?, 'uploads/room-designs/pavement-designs.jpeg', ?, 3),
       (?, 'uploads/room-designs/living-room-designs.jpeg', ?, 4),
       (?, 'uploads/room-designs/elevation-designs.png', ?, 5),
       (?, 'uploads/room-designs/parking-designs.png', ?, 6),
       (?, 'uploads/room-designs/kitchen-room-designs.png', ?, 7)`,
      [
        'Room Designs', JSON.stringify(['Living Room/Bedroom', 'Office/Commercial/Shop']),
        'Bathroom Designs', JSON.stringify(['Bathroom', 'Bathroom/Dining', 'Bathroom/Kitchen', 'Bathroom/Toilet/Kitchen', 'Outdoor/Bathroom']),
        'Pavement Designs', JSON.stringify(['Parking/Driveway/Garage']),
        'Living Room Designs', JSON.stringify(['Living Room/Bedroom']),
        'Elevation Designs', JSON.stringify(['Elevation/Exterior']),
        'Parking Designs', JSON.stringify(['Parking/Driveway/Garage']),
        'Kitchen Room Designs', JSON.stringify(['Bathroom/Toilet/Kitchen', 'Bathroom/Kitchen']),
      ],
    );
  }

  await pool.query(`
    CREATE TABLE IF NOT EXISTS gallery_items (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      title VARCHAR(100) NOT NULL,
      image VARCHAR(255) NOT NULL,
      category VARCHAR(50) NOT NULL DEFAULT 'Gallery',
      object_position VARCHAR(50) NOT NULL DEFAULT 'center',
      filter_state TEXT NOT NULL,
      sort_order INT UNSIGNED NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY gallery_items_sort_order_unique (sort_order)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS home_offer_sections (
      section_type VARCHAR(30) NOT NULL,
      configured TINYINT(1) NOT NULL DEFAULT 0,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (section_type)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS product_settings (
      setting_key VARCHAR(50) NOT NULL PRIMARY KEY,
      setting_value VARCHAR(255) NOT NULL,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await pool.query(
    "INSERT IGNORE INTO product_settings (setting_key, setting_value) VALUES ('display_max_price', '8500')"
  );

  await pool.query(`
    CREATE TABLE IF NOT EXISTS home_offer_items (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      section_type VARCHAR(30) NOT NULL,
      product_name VARCHAR(100) NOT NULL,
      category VARCHAR(50) NOT NULL,
      size VARCHAR(50) NOT NULL,
      finish VARCHAR(60) NOT NULL,
      mrp DECIMAL(10,2) NULL,
      offer_price DECIMAL(10,2) NULL,
      availability VARCHAR(150) NOT NULL,
      arrival_status VARCHAR(40) NULL,
      image VARCHAR(255) NOT NULL,
      sort_order SMALLINT UNSIGNED NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY home_offer_items_section_order_unique (section_type, sort_order),
      CONSTRAINT home_offer_items_section_fk FOREIGN KEY (section_type)
        REFERENCES home_offer_sections (section_type) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await pool.query('ALTER TABLE home_offer_items MODIFY sort_order SMALLINT UNSIGNED NOT NULL');
  try {
    await pool.query('ALTER TABLE home_offer_items ADD COLUMN discount INT DEFAULT NULL');
  } catch (err) {
    if (err.code !== 'ER_DUP_FIELDNAME') console.error('Error adding discount column:', err.message);
  }

  await pool.query(
    `INSERT IGNORE INTO home_offer_sections (section_type, configured)
     VALUES ('todays_offer', 0), ('launching_offer', 0), ('new_arrivals', 0)`,
  );

  const [[offerSeedState]] = await pool.query(
    `SELECT
       (SELECT COUNT(*) FROM home_offer_items) AS itemCount,
       (SELECT COALESCE(SUM(configured), 0) FROM home_offer_sections) AS configuredCount`,
  );
  if (Number(offerSeedState.itemCount) === 0 && Number(offerSeedState.configuredCount) === 0) {
    await pool.query(`
      INSERT INTO home_offer_items
        (section_type, product_name, category, size, finish, mrp, offer_price, availability, arrival_status, image, sort_order)
      VALUES
        ('todays_offer', 'CATALINA BEIGE', 'Tiles', '600x600 mm', 'Glossy/High Glossy', 350, 290,
          'Limited-period showroom offer', NULL, 'uploads/offers/today-catalina-beige.png', 1),
        ('launching_offer', 'DOMINO BLUE', 'Tiles', '600x600 mm', 'Satin/Matt', 410, 340,
          'Coming soon to our showroom', NULL, 'uploads/offers/launching-domino-blue.png', 1),
        ('new_arrivals', 'CATALINA BEIGE', 'Tiles', '600x600 mm', 'Glossy/High Glossy', NULL, NULL,
          'Availability will be announced soon', 'Coming soon', 'uploads/offers/arrival-1-catalina-beige.png', 1),
        ('new_arrivals', 'DOMINO BLUE', 'Tiles', '600x600 mm', 'Satin/Matt', NULL, NULL,
          'Availability will be announced soon', 'Coming soon', 'uploads/offers/arrival-2-domino-blue.png', 2),
        ('new_arrivals', 'ELEVATION SLATE', 'Tiles', '300x600 mm', 'Structured', NULL, NULL,
          'Availability will be announced soon', 'Coming soon', 'uploads/offers/arrival-3-elevation-slate.png', 3),
        ('new_arrivals', 'KAG RIMLESS ONE PIECE CLOSET', 'Sanitary Wares', 'Standard', 'Glossy White', NULL, NULL,
          'Availability will be announced soon', 'Coming soon', 'uploads/offers/arrival-4-rimless-closet.png', 4),
        ('new_arrivals', 'KAG TABLE TOP WASH BASIN', 'Sanitary Wares', 'Standard', 'Glossy White', NULL, NULL,
          'Availability will be announced soon', 'Coming soon', 'uploads/offers/arrival-5-tabletop-basin.png', 5),
        ('new_arrivals', 'KAG PREMIUM SHOWER HEAD', 'Bath Fittings', 'Standard', 'Chrome', NULL, NULL,
          'Availability will be announced soon', 'Coming soon', 'uploads/offers/arrival-6-shower-head.png', 6)
    `);
    await pool.query('UPDATE home_offer_sections SET configured = 1');
  }

  await pool.query(`
    CREATE TABLE IF NOT EXISTS home_category_settings (
      id TINYINT UNSIGNED NOT NULL,
      configured TINYINT(1) NOT NULL DEFAULT 0,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
  await pool.query('INSERT IGNORE INTO home_category_settings (id, configured) VALUES (1, 0)');

  await pool.query(`
    CREATE TABLE IF NOT EXISTS home_categories (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      name VARCHAR(60) NOT NULL,
      group_name VARCHAR(50) NOT NULL,
      image VARCHAR(255) NOT NULL,
      sort_order SMALLINT UNSIGNED NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY home_categories_name_unique (name),
      UNIQUE KEY home_categories_sort_order_unique (sort_order)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  const [[categorySeedState]] = await pool.query(
    `SELECT
       (SELECT COUNT(*) FROM home_categories) AS itemCount,
       (SELECT configured FROM home_category_settings WHERE id = 1) AS configured`,
  );
  if (Number(categorySeedState.itemCount) === 0 && !Number(categorySeedState.configured)) {
    await pool.query(`
      INSERT INTO home_categories (name, group_name, image, sort_order) VALUES
        ('All Tiles', 'Tiles', 'uploads/categories/01-all-tiles.png', 1),
        ('Wall Tiles', 'Tiles', 'uploads/categories/02-wall-tiles.png', 2),
        ('Floor Tiles', 'Tiles', 'uploads/categories/03-floor-tiles.png', 3),
        ('Athangudi Tiles', 'Tiles', 'uploads/categories/04-athangudi-tiles.png', 4),
        ('Sanitary Wares', 'Sanitary Wares', 'uploads/categories/05-sanitary-wares.png', 5),
        ('Flush Tanks', 'Sanitary Wares', 'uploads/categories/06-flush-tanks.png', 6),
        ('Bath Fittings', 'Bath Fittings', 'uploads/categories/07-bath-fittings.png', 7),
        ('Kitchen Sinks', 'Bath Fittings', 'uploads/categories/08-kitchen-sinks.png', 8),
        ('PTMT Taps', 'Bath Fittings', 'uploads/categories/09-ptmt-taps.png', 9),
        ('Adhesives & Grout', 'Others', 'uploads/categories/10-adhesives-grout.png', 10)
    `);
    await pool.query('UPDATE home_category_settings SET configured = 1 WHERE id = 1');
  }

  const [[{ galleryItemCount }]] = await pool.query('SELECT COUNT(*) AS galleryItemCount FROM gallery_items');
  if (Number(galleryItemCount) === 0) {
    await pool.query(
      `INSERT INTO gallery_items (title, image, category, object_position, filter_state, sort_order) VALUES
       (?, 'uploads/gallery/floor_tiles.png', 'Tiles', 'center 64%', ?, 1),
       (?, 'uploads/gallery/wall_tiles.png', 'Tiles', 'center', ?, 2),
       (?, 'uploads/gallery/all_tiles.png', 'Tiles', 'center', ?, 3),
       (?, 'uploads/gallery/athangudi_tiles.png', 'Tiles', 'center', ?, 4),
       (?, 'uploads/gallery/sanitary-ware-gallery-v2.png', 'Sanitary Wares', 'center 58%', ?, 5),
       (?, 'uploads/gallery/sanitaryware.png', 'Sanitary Wares', 'center', ?, 6),
       (?, 'uploads/gallery/flush_tank.png', 'Sanitary Wares', 'center', ?, 7),
       (?, 'uploads/gallery/bath-fittings-gallery-v2.png', 'Bath Fittings', '36% center', ?, 8),
       (?, 'uploads/gallery/aqua_faucet.png', 'Bath Fittings', 'center', ?, 9),
       (?, 'uploads/gallery/ptmt_taps.png', 'Others', 'center', ?, 10),
       (?, 'uploads/gallery/adhesive_grout.png', 'Others', 'center', ?, 11),
       (?, 'uploads/gallery/kitchen_sink.png', 'Others', 'center', ?, 12)`,
      [
        'Premium Floor Tiles', JSON.stringify({ filterCategory: 'room', filterValue: 'Living Room' }),
        'Decorative Wall Tiles', JSON.stringify({ filterCategory: 'room', filterValue: 'Bathroom Tiles' }),
        'Designer Tile Collection', JSON.stringify({ filterCategory: 'category', filterValue: 'Tiles' }),
        'Athangudi Heritage Tiles', JSON.stringify({ filterCategory: 'category', filterValue: 'Tiles' }),
        'Sanitary Ware Collection', JSON.stringify({ filterCategory: 'category', filterValue: 'Sanitary Wares' }),
        'Luxury Bathroom Suite', JSON.stringify({ filterCategory: 'category', filterValue: 'Sanitary Wares' }),
        'Modern Flush Tank', JSON.stringify({ filterCategory: 'category', filterValue: 'Sanitary Wares' }),
        'Premium Bath Fittings', JSON.stringify({ filterCategory: 'category', filterValue: 'Bath Fittings' }),
        'Chrome Basin Mixer', JSON.stringify({ searchQuery: 'AQUA LUXURY BASIN MIXER' }),
        'PTMT Designer Tap', JSON.stringify({ searchQuery: 'PTMT LEAK-PROOF TAP' }),
        'Tile Adhesive & Grout', JSON.stringify({ searchQuery: 'KAG PREMIUM TILE ADHESIVE' }),
        'Kitchen Sink Collection', JSON.stringify({ filterCategory: 'category', filterValue: 'Others' }),
      ],
    );
  }

  await pool.query(`
    CREATE TABLE IF NOT EXISTS testimonial_settings (
      id TINYINT UNSIGNED NOT NULL,
      initialized TINYINT(1) NOT NULL DEFAULT 0,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
  await pool.query('INSERT IGNORE INTO testimonial_settings (id, initialized) VALUES (1, 0)');

  await pool.query(`
    CREATE TABLE IF NOT EXISTS testimonials (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      customer_name VARCHAR(80) NOT NULL,
      designation VARCHAR(100) NOT NULL,
      description VARCHAR(700) NOT NULL,
      star_rating TINYINT UNSIGNED NOT NULL,
      sort_order INT UNSIGNED NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY testimonials_sort_order_unique (sort_order)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  const [[testimonialSeedState]] = await pool.query(
    `SELECT
       (SELECT COUNT(*) FROM testimonials) AS itemCount,
       (SELECT initialized FROM testimonial_settings WHERE id = 1) AS initialized`,
  );
  if (Number(testimonialSeedState.itemCount) === 0 && !Number(testimonialSeedState.initialized)) {
    const description = 'Lorem ipsum dolor sit amet, consec adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam, quis nostrud exercitation ullamco laboris. Integer ac orci vitae neque porttitor efficitur best flooring services';
    await pool.query(
      `INSERT INTO testimonials (customer_name, designation, description, star_rating, sort_order) VALUES
       ('Anan Hanona', 'Interior Expert And Customer', ?, 5, 1),
       ('Mahfuz Riad', 'Interior Expert And Customer', ?, 5, 2),
       ('Anan Hanona', 'Interior Expert And Customer', ?, 5, 3)`,
      [description, description, description],
    );
    await pool.query('UPDATE testimonial_settings SET initialized = 1 WHERE id = 1');
  }

  await pool.query(`
    CREATE TABLE IF NOT EXISTS blog_settings (
      id TINYINT UNSIGNED NOT NULL,
      initialized TINYINT(1) NOT NULL DEFAULT 0,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
  await pool.query('INSERT IGNORE INTO blog_settings (id, initialized) VALUES (1, 0)');

  await pool.query(`
    CREATE TABLE IF NOT EXISTS blogs (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      title VARCHAR(180) NOT NULL,
      description MEDIUMTEXT NOT NULL,
      excerpt TEXT NOT NULL,
      media VARCHAR(255) NOT NULL,
      media_type VARCHAR(10) NOT NULL,
      category VARCHAR(60) NOT NULL DEFAULT 'SJ Ceramics',
      author VARCHAR(80) NOT NULL DEFAULT 'SJ Ceramics',
      display_date VARCHAR(30) NOT NULL,
      sort_order INT UNSIGNED NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY blogs_title_unique (title),
      UNIQUE KEY blogs_sort_order_unique (sort_order)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS contact_enquiries (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      full_name VARCHAR(60) NOT NULL,
      email VARCHAR(120) NOT NULL,
      phone VARCHAR(10) NOT NULL,
      address VARCHAR(200) NULL,
      message VARCHAR(700) NOT NULL,
      submitted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      KEY contact_enquiries_submitted_at_index (submitted_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  try {
    await pool.query('ALTER TABLE contact_enquiries ADD COLUMN IF NOT EXISTS address VARCHAR(200) NULL AFTER phone');
  } catch (err) {
    // Ignore if column already exists
  }

  await pool.query(`
    CREATE TABLE IF NOT EXISTS enquiries (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      type VARCHAR(20) NOT NULL,
      full_name VARCHAR(100) NOT NULL,
      email VARCHAR(120) NOT NULL,
      phone VARCHAR(20) NOT NULL,
      address1 VARCHAR(150) NULL,
      address2 VARCHAR(150) NULL,
      state VARCHAR(60) NULL,
      city VARCHAR(60) NULL,
      details JSON NOT NULL,
      status VARCHAR(30) NOT NULL DEFAULT 'New',
      submitted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      KEY enquiries_type_idx (type)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  // Remove static sample entries if any were previously seeded
  await pool.query(
    "DELETE FROM enquiries WHERE email IN ('rajesh.kumar@example.com', 'priya.s@example.com', 'arun.s@example.com')"
  );

  await pool.query(`
    CREATE TABLE IF NOT EXISTS page_meta (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      page_key VARCHAR(40) NOT NULL,
      page_label VARCHAR(80) NOT NULL,
      meta_title VARCHAR(70) NOT NULL,
      meta_keywords VARCHAR(250) NOT NULL,
      meta_description VARCHAR(170) NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY page_meta_page_key_unique (page_key)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS explore_collection_settings (
      id TINYINT UNSIGNED NOT NULL,
      initialized TINYINT(1) NOT NULL DEFAULT 0,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
  await pool.query('INSERT IGNORE INTO explore_collection_settings (id, initialized) VALUES (1, 0)');

  await pool.query(`
    CREATE TABLE IF NOT EXISTS explore_collections (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      collection_type VARCHAR(20) NOT NULL,
      name VARCHAR(40) NULL,
      name_key VARCHAR(80) NULL,
      color_value VARCHAR(100) NULL,
      width_value DECIMAL(6,2) NULL,
      height_value DECIMAL(6,2) NULL,
      thickness_value DECIMAL(5,2) NULL,
      display_value VARCHAR(40) NOT NULL,
      identity_key VARCHAR(191) NOT NULL,
      sort_order INT UNSIGNED NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY explore_collections_identity_unique (identity_key),
      UNIQUE KEY explore_collections_name_unique (name_key),
      UNIQUE KEY explore_collections_type_order_unique (collection_type, sort_order),
      KEY explore_collections_type_index (collection_type)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  const [[collectionSeedState]] = await pool.query(
    `SELECT
       (SELECT COUNT(*) FROM explore_collections) AS itemCount,
       (SELECT initialized FROM explore_collection_settings WHERE id = 1) AS initialized`,
  );
  if (Number(collectionSeedState.itemCount) === 0 && !Number(collectionSeedState.initialized)) {
    const typeOrders = { colors: 0, size: 0, thickness: 0 };
    for (const item of exploreCollectionsSeed) {
      typeOrders[item.type] += 1;
      const numeric = (value) => Number(value).toString();
      const identityKey = item.type === 'colors'
        ? `colors:${item.colorValue.toLowerCase()}`
        : item.type === 'size' ? `size:${numeric(item.width)}:${numeric(item.height)}` : `thickness:${numeric(item.thickness)}`;
      await pool.execute(
        `INSERT INTO explore_collections
          (collection_type, name, name_key, color_value, width_value, height_value, thickness_value, display_value, identity_key, sort_order)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          item.type,
          item.name || null,
          item.name ? `color-name:${item.name.toLocaleLowerCase('en')}` : null,
          item.colorValue || null,
          item.width ?? null,
          item.height ?? null,
          item.thickness ?? null,
          item.displayValue || item.name,
          identityKey,
          typeOrders[item.type],
        ],
      );
    }
    await pool.query('UPDATE explore_collection_settings SET initialized = 1 WHERE id = 1');
  }

  const [[blogSeedState]] = await pool.query(
    `SELECT
       (SELECT COUNT(*) FROM blogs) AS itemCount,
       (SELECT initialized FROM blog_settings WHERE id = 1) AS initialized`,
  );
  if (Number(blogSeedState.itemCount) === 0 && !Number(blogSeedState.initialized)) {
    for (const [index, blog] of blogSeed.entries()) {
      await pool.execute(
        `INSERT INTO blogs
          (title, description, excerpt, media, media_type, category, author, display_date, sort_order)
         VALUES (?, ?, ?, ?, 'image', ?, ?, ?, ?)`,
        [blog.title, blog.description, blog.excerpt, blog.media, blog.category, blog.author, blog.displayDate, index + 1],
      );
    }
    await pool.query('UPDATE blog_settings SET initialized = 1 WHERE id = 1');
  }

  const [[{ count }]] = await pool.query('SELECT COUNT(*) AS count FROM banners');
  if (Number(count) === 0) {
    await pool.query(
      `INSERT INTO banners (title, description, image, placement, sort_order) VALUES
       (?, ?, NULL, 'Home hero', 1),
       (?, ?, NULL, 'Home hero', 2),
       (?, ?, NULL, 'Products', 3)`,
      [
        'Luxury Tiles Collection', 'Timeless surfaces for beautiful spaces',
        'Premium Bathware', 'Thoughtful design meets everyday comfort',
        'New Arrivals 2026', 'Discover our latest ceramic collection',
      ],
    );
  }

  // Create products table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS products (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      name VARCHAR(150) NOT NULL,
      category VARCHAR(60) NOT NULL,
      preference VARCHAR(30) NOT NULL,
      product_type VARCHAR(100) NULL,
      type VARCHAR(100) NULL,
      price DECIMAL(10,2) NULL,
      size VARCHAR(50) NULL,
      finish VARCHAR(100) NULL,
      where_to_use VARCHAR(255) NULL,
      material VARCHAR(150) NULL,
      color VARCHAR(100) NULL,
      net_quantity VARCHAR(50) NULL,
      mrp_price DECIMAL(10,2) NULL,
      sale_price DECIMAL(10,2) NULL,
      image VARCHAR(255) NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await pool.query(`
    UPDATE products
    SET category = CASE
      WHEN category IN ('Sanitary Wares', 'Sanitary Ware', 'Sanitaryware') THEN 'Sanitarywares'
      WHEN category = 'Bath Fittings' THEN 'Bath fittings'
      ELSE category
    END
  `);

  // Create footer_columns table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS footer_columns (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      title VARCHAR(150) NOT NULL,
      column_type VARCHAR(50) NOT NULL DEFAULT 'size',
      links TEXT NOT NULL,
      sort_order INT UNSIGNED NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY footer_columns_sort_order_unique (sort_order)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await pool.query(`
    UPDATE footer_columns
    SET column_type = CASE
      WHEN title = 'Tiles By Material' AND column_type = 'search' THEN 'material'
      WHEN title = 'Where To Use' AND column_type = 'search' THEN 'usage'
      ELSE column_type
    END
  `);

  // Seeding products
  const [[{ productCount }]] = await pool.query('SELECT COUNT(*) AS productCount FROM products');
  if (Number(productCount) === 0) {
    const sourceDir = path.resolve(__dirname, '..', '..', 'frontend', 'src', 'assets', 'images', 'resource', 'products', 'kag-tiles');
    const destDir = path.resolve(__dirname, '..', 'uploads', 'products');
    
    // Ensure destination directory exists
    fs.mkdirSync(destDir, { recursive: true });

    if (fs.existsSync(sourceDir)) {
      try {
        const files = fs.readdirSync(sourceDir);
        for (const file of files) {
          const srcFile = path.join(sourceDir, file);
          const destFile = path.join(destDir, file);
          if (!fs.existsSync(destFile)) {
            fs.copyFileSync(srcFile, destFile);
          }
        }
      } catch (err) {
        console.error('Failed to copy product seeds images:', err.message);
      }
    }

    // Insert seeded products
    for (const p of productsSeed) {
      await pool.execute(
        `INSERT INTO products 
         (name, category, preference, product_type, type, price, size, finish, where_to_use, material, color, net_quantity, mrp_price, sale_price, image) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          p.name,
          p.category,
          p.preference,
          p.product_type,
          p.type,
          p.price,
          p.size,
          p.finish,
          p.where_to_use,
          p.material,
          p.color,
          p.net_quantity,
          p.price ? Math.ceil((p.price * 1.18) / 10) * 10 : null,
          p.price || null,
          p.image
        ]
      );
    }
  }

  // Seeding footer columns
  const [[{ footerCount }]] = await pool.query('SELECT COUNT(*) AS footerCount FROM footer_columns');
  if (Number(footerCount) === 0) {
    for (const col of footerSeed) {
      await pool.execute(
        `INSERT INTO footer_columns (title, column_type, links, sort_order) VALUES (?, ?, ?, ?)`,
        [
          col.title,
          col.column_type,
          JSON.stringify(col.links),
          col.sort_order
        ]
      );
    }
  }
};

module.exports = pool;
module.exports.initializeDatabase = initializeDatabase;
