const db = require('../config/db');

const TYPES = new Set(['colors', 'size', 'thickness']);
const HEX_PATTERN = /^#[0-9A-F]{6}$/;
const DECIMAL_PATTERN = /^\d{1,3}(?:\.\d{1,2})?$/;
const countWords = (value) => value.trim().split(/\s+/).filter(Boolean).length;
const normalize = (value) => typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : '';
const decimalText = (value) => Number(value).toString();

const validateDecimal = (rawValue, field, label, maximum, errors) => {
  const value = typeof rawValue === 'number' ? String(rawValue) : normalize(rawValue);
  if (!value) {
    errors[field] = `${label} is required.`;
    return null;
  }
  if (!DECIMAL_PATTERN.test(value)) {
    errors[field] = `${label} must be a positive number with up to 2 decimal places.`;
    return null;
  }
  const number = Number(value);
  if (number <= 0 || number > maximum) {
    errors[field] = `${label} must be between 0.01 and ${maximum}.`;
    return null;
  }
  return number;
};

const validate = (body = {}, existing = null) => {
  const errors = {};
  const type = normalize(body.type).toLowerCase();
  if (!type) errors.type = 'Collection type is required.';
  else if (!TYPES.has(type)) errors.type = 'Select a valid collection type.';
  else if (existing && type !== existing.collection_type) errors.type = 'Collection type cannot be changed while editing.';

  const result = { errors, type, name: null, nameKey: null, colorValue: null, width: null, height: null, thickness: null, displayValue: '', identityKey: '' };
  if (!TYPES.has(type)) return result;

  if (type === 'colors') {
    const name = normalize(body.colorName);
    const enteredColor = normalize(body.colorHex);
    const colorValue = enteredColor.toUpperCase();
    const unchangedLegacyColor = Boolean(existing && enteredColor === existing.color_value && !HEX_PATTERN.test(colorValue));
    if (!name) errors.colorName = 'Colour name is required.';
    else if (name.length < 2 || name.length > 40) errors.colorName = 'Colour name must contain 2-40 characters.';
    else if (countWords(name) > 5) errors.colorName = 'Colour name must contain 5 words or fewer.';
    else if (!/[\p{L}\p{M}]/u.test(name) || !/^[\p{L}\p{M}\p{N} '&-]+$/u.test(name)) errors.colorName = 'Use only letters, numbers, spaces, apostrophes, or hyphens.';
    if (!enteredColor) errors.colorHex = 'Colour value is required.';
    else if (!HEX_PATTERN.test(colorValue) && !unchangedLegacyColor) errors.colorHex = 'Select a valid six-digit colour value.';

    result.name = name;
    result.nameKey = `color-name:${name.toLocaleLowerCase('en')}`;
    result.colorValue = unchangedLegacyColor ? enteredColor : colorValue;
    result.displayValue = name;
    result.identityKey = `colors:${result.colorValue.toLowerCase()}`;
  } else if (type === 'size') {
    const width = validateDecimal(body.width, 'width', 'Width', 999, errors);
    const height = validateDecimal(body.height, 'height', 'Height', 999, errors);
    result.width = width;
    result.height = height;
    if (width !== null && height !== null) {
      result.displayValue = `${decimalText(width)}×${decimalText(height)}`;
      result.identityKey = `size:${decimalText(width)}:${decimalText(height)}`;
    }
  } else {
    const thickness = validateDecimal(body.thickness, 'thickness', 'Thickness', 100, errors);
    result.thickness = thickness;
    if (thickness !== null) {
      result.displayValue = `${decimalText(thickness)} mm`;
      result.identityKey = `thickness:${decimalText(thickness)}`;
    }
  }
  return result;
};

const serialize = (row) => ({
  id: row.id,
  type: row.collection_type,
  colorName: row.name,
  colorHex: row.color_value,
  width: row.width_value === null ? null : Number(row.width_value),
  height: row.height_value === null ? null : Number(row.height_value),
  thickness: row.thickness_value === null ? null : Number(row.thickness_value),
  displayValue: row.display_value,
  sortOrder: row.sort_order,
  updatedAt: row.updated_at,
});

const duplicateResponse = (res, error, validated) => {
  if (error.code !== 'ER_DUP_ENTRY') return false;
  const fields = validated.type === 'colors'
    ? { colorName: 'This colour name or colour value is already configured.', colorHex: 'This colour name or colour value is already configured.' }
    : validated.type === 'size' ? { width: 'This size is already configured.', height: 'This size is already configured.' }
      : { thickness: 'This thickness is already configured.' };
  res.status(409).json({ success: false, message: 'This collection entry already exists.', errors: fields });
  return true;
};

const getExploreCollections = async (_req, res, next) => {
  try {
    const [rows] = await db.query("SELECT * FROM explore_collections ORDER BY FIELD(collection_type, 'colors', 'size', 'thickness'), sort_order, id");
    return res.json({ success: true, data: rows.map(serialize) });
  } catch (error) {
    return next(error);
  }
};

const createExploreCollection = async (req, res, next) => {
  const validated = validate(req.body);
  if (Object.keys(validated.errors).length) return res.status(400).json({ success: false, message: 'Collection validation failed.', errors: validated.errors });
  try {
    const [[{ nextOrder }]] = await db.execute('SELECT COALESCE(MAX(sort_order), 0) + 1 AS nextOrder FROM explore_collections WHERE collection_type = ?', [validated.type]);
    const [result] = await db.execute(
      `INSERT INTO explore_collections
        (collection_type, name, name_key, color_value, width_value, height_value, thickness_value, display_value, identity_key, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [validated.type, validated.name, validated.nameKey, validated.colorValue, validated.width, validated.height, validated.thickness, validated.displayValue, validated.identityKey, nextOrder],
    );
    await db.execute('UPDATE explore_collection_settings SET initialized = 1 WHERE id = 1');
    const [rows] = await db.execute('SELECT * FROM explore_collections WHERE id = ?', [result.insertId]);
    return res.status(201).json({ success: true, message: 'Collection entry added successfully.', data: serialize(rows[0]) });
  } catch (error) {
    if (duplicateResponse(res, error, validated)) return undefined;
    return next(error);
  }
};

const updateExploreCollection = async (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) return res.status(400).json({ success: false, message: 'Invalid collection id.' });
  try {
    const [existingRows] = await db.execute('SELECT * FROM explore_collections WHERE id = ?', [id]);
    if (!existingRows.length) return res.status(404).json({ success: false, message: 'Collection entry not found.' });
    const validated = validate(req.body, existingRows[0]);
    if (Object.keys(validated.errors).length) return res.status(400).json({ success: false, message: 'Collection validation failed.', errors: validated.errors });
    try {
      await db.execute(
        `UPDATE explore_collections
         SET name = ?, name_key = ?, color_value = ?, width_value = ?, height_value = ?, thickness_value = ?, display_value = ?, identity_key = ?
         WHERE id = ?`,
        [validated.name, validated.nameKey, validated.colorValue, validated.width, validated.height, validated.thickness, validated.displayValue, validated.identityKey, id],
      );
    } catch (error) {
      if (duplicateResponse(res, error, validated)) return undefined;
      throw error;
    }
    await db.execute('UPDATE explore_collection_settings SET initialized = 1 WHERE id = 1');
    const [rows] = await db.execute('SELECT * FROM explore_collections WHERE id = ?', [id]);
    return res.json({ success: true, message: 'Collection entry updated successfully.', data: serialize(rows[0]) });
  } catch (error) {
    return next(error);
  }
};

const deleteExploreCollection = async (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) return res.status(400).json({ success: false, message: 'Invalid collection id.' });
  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();
    const [rows] = await connection.execute('SELECT collection_type, sort_order FROM explore_collections WHERE id = ? FOR UPDATE', [id]);
    if (!rows.length) {
      await connection.rollback();
      return res.status(404).json({ success: false, message: 'Collection entry not found.' });
    }
    await connection.execute('DELETE FROM explore_collections WHERE id = ?', [id]);
    await connection.execute('UPDATE explore_collections SET sort_order = sort_order - 1 WHERE collection_type = ? AND sort_order > ? ORDER BY sort_order', [rows[0].collection_type, rows[0].sort_order]);
    await connection.execute('UPDATE explore_collection_settings SET initialized = 1 WHERE id = 1');
    await connection.commit();
    return res.json({ success: true, message: 'Collection entry deleted successfully.' });
  } catch (error) {
    if (connection) await connection.rollback().catch(() => {});
    return next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = { getExploreCollections, createExploreCollection, updateExploreCollection, deleteExploreCollection, validate };
