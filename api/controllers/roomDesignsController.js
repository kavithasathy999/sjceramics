const fs = require('fs/promises');
const path = require('path');
const db = require('../config/db');

const uploadDirectory = path.resolve(__dirname, '..', 'uploads', 'room-designs');
const storedPath = (filename) => `uploads/room-designs/${path.basename(filename)}`;
const publicUrl = (req, value) => `${req.protocol}://${req.get('host')}/${value.replace(/\\/g, '/').replace(/^\/+/, '')}`;
const countWords = (value) => value.trim().split(/\s+/).filter(Boolean).length;

const validateTitle = (value) => {
  const title = typeof value === 'string' ? value.trim() : '';
  if (!title) return { title, error: 'Room design title is required.' };
  if (countWords(title) > 4) return { title, error: 'Room design title must contain 4 words or fewer.' };
  return { title, error: '' };
};

const validateSortOrder = (value, maximum) => {
  const sortOrder = Number(value);
  if (!Number.isInteger(sortOrder) || sortOrder < 1) {
    return { sortOrder, error: 'Sort order must be a positive whole number.' };
  }
  if (sortOrder > maximum) {
    return { sortOrder, error: `Sort order must be between 1 and ${maximum}.` };
  }
  return { sortOrder, error: '' };
};

const removeFile = async (value) => {
  if (!value) return;
  try {
    await fs.unlink(path.join(uploadDirectory, path.basename(value)));
  } catch (error) {
    if (error.code !== 'ENOENT') console.error('Room design image cleanup failed:', error);
  }
};

const serialize = (req, row) => ({
  id: row.id,
  title: row.title,
  imageUrl: publicUrl(req, row.image),
  applications: JSON.parse(row.applications),
  sortOrder: row.sort_order,
  updatedAt: row.updated_at,
});

const getRoomDesigns = async (req, res, next) => {
  try {
    const [rows] = await db.query('SELECT * FROM room_designs ORDER BY sort_order ASC, id ASC');
    return res.json({ success: true, data: rows.map((row) => serialize(req, row)) });
  } catch (error) {
    return next(error);
  }
};

const createRoomDesign = async (req, res, next) => {
  const validated = validateTitle(req.body.title);
  if (validated.error || !req.file) {
    if (req.file) await removeFile(req.file.filename);
    return res.status(400).json({
      success: false,
      message: validated.error || 'Choose a room design image.',
    });
  }

  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();
    const [[{ designCount }]] = await connection.query('SELECT COUNT(*) AS designCount FROM room_designs FOR UPDATE');
    const validatedOrder = validateSortOrder(req.body.sortOrder, Number(designCount) + 1);
    if (validatedOrder.error) {
      await connection.rollback();
      await removeFile(req.file.filename);
      return res.status(400).json({ success: false, message: validatedOrder.error });
    }

    await connection.execute(
      'UPDATE room_designs SET sort_order = sort_order + 1 WHERE sort_order >= ? ORDER BY sort_order DESC',
      [validatedOrder.sortOrder],
    );
    const [result] = await connection.execute(
      'INSERT INTO room_designs (title, image, applications, sort_order) VALUES (?, ?, ?, ?)',
      [validated.title, storedPath(req.file.filename), '[]', validatedOrder.sortOrder],
    );
    const [created] = await connection.execute('SELECT * FROM room_designs WHERE id = ?', [result.insertId]);
    await connection.commit();
    return res.status(201).json({ success: true, message: 'Room design added successfully.', data: serialize(req, created[0]) });
  } catch (error) {
    if (connection) await connection.rollback().catch(() => {});
    await removeFile(req.file.filename);
    return next(error);
  } finally {
    if (connection) connection.release();
  }
};

const updateRoomDesign = async (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    if (req.file) await removeFile(req.file.filename);
    return res.status(400).json({ success: false, message: 'Invalid room design id.' });
  }
  const validated = validateTitle(req.body.title);
  if (validated.error) {
    if (req.file) await removeFile(req.file.filename);
    return res.status(400).json({ success: false, message: validated.error });
  }

  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();
    const [rows] = await connection.execute('SELECT * FROM room_designs WHERE id = ? FOR UPDATE', [id]);
    if (!rows.length) {
      await connection.rollback();
      if (req.file) await removeFile(req.file.filename);
      return res.status(404).json({ success: false, message: 'Room design not found.' });
    }

    const [[{ designCount }]] = await connection.query('SELECT COUNT(*) AS designCount FROM room_designs');
    const validatedOrder = validateSortOrder(req.body.sortOrder, Number(designCount));
    if (validatedOrder.error) {
      await connection.rollback();
      if (req.file) await removeFile(req.file.filename);
      return res.status(400).json({ success: false, message: validatedOrder.error });
    }

    const currentOrder = Number(rows[0].sort_order);
    const nextImage = req.file ? storedPath(req.file.filename) : rows[0].image;
    if (validatedOrder.sortOrder !== currentOrder) {
      const [[{ temporaryOrder }]] = await connection.query('SELECT COALESCE(MAX(sort_order), 0) + 1 AS temporaryOrder FROM room_designs');
      await connection.execute('UPDATE room_designs SET sort_order = ? WHERE id = ?', [Number(temporaryOrder), id]);

      if (validatedOrder.sortOrder < currentOrder) {
        await connection.execute(
          'UPDATE room_designs SET sort_order = sort_order + 1 WHERE sort_order >= ? AND sort_order < ? ORDER BY sort_order DESC',
          [validatedOrder.sortOrder, currentOrder],
        );
      } else {
        await connection.execute(
          'UPDATE room_designs SET sort_order = sort_order - 1 WHERE sort_order > ? AND sort_order <= ? ORDER BY sort_order ASC',
          [currentOrder, validatedOrder.sortOrder],
        );
      }
    }

    await connection.execute(
      'UPDATE room_designs SET title = ?, image = ?, sort_order = ? WHERE id = ?',
      [validated.title, nextImage, validatedOrder.sortOrder, id],
    );
    const [updated] = await connection.execute('SELECT * FROM room_designs WHERE id = ?', [id]);
    await connection.commit();
    if (req.file) await removeFile(rows[0].image);
    return res.json({ success: true, message: 'Room design updated successfully.', data: serialize(req, updated[0]) });
  } catch (error) {
    if (connection) await connection.rollback().catch(() => {});
    if (req.file) await removeFile(req.file.filename);
    return next(error);
  } finally {
    if (connection) connection.release();
  }
};

const deleteRoomDesign = async (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) return res.status(400).json({ success: false, message: 'Invalid room design id.' });

  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();
    const [rows] = await connection.execute('SELECT image, sort_order FROM room_designs WHERE id = ? FOR UPDATE', [id]);
    if (!rows.length) {
      await connection.rollback();
      return res.status(404).json({ success: false, message: 'Room design not found.' });
    }
    await connection.execute('DELETE FROM room_designs WHERE id = ?', [id]);
    await connection.execute(
      'UPDATE room_designs SET sort_order = sort_order - 1 WHERE sort_order > ? ORDER BY sort_order ASC',
      [rows[0].sort_order],
    );
    await connection.commit();
    await removeFile(rows[0].image);
    return res.json({ success: true, message: 'Room design deleted successfully.' });
  } catch (error) {
    if (connection) await connection.rollback().catch(() => {});
    return next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = { getRoomDesigns, createRoomDesign, updateRoomDesign, deleteRoomDesign };
