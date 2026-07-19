const mysql = require('mysql2/promise');

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
};

module.exports = pool;
module.exports.initializeDatabase = initializeDatabase;
