const assert = require('node:assert/strict');
const test = require('node:test');

require('dotenv').config();
const app = require('../server');
const db = require('../config/db');

const request = (baseUrl, method, body, id = '') => fetch(`${baseUrl}${id ? `/${id}` : ''}`, {
  method,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});

test('explore collections preserve static seeds and validate managed CRUD fields', async () => {
  await db.initializeDatabase();
  const server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  const baseUrl = `http://127.0.0.1:${server.address().port}/api/explore-collections`;
  const createdIds = [];

  try {
    const initialResponse = await fetch(baseUrl);
    const initial = await initialResponse.json();
    assert.equal(initialResponse.status, 200);
    assert.equal(initial.data.filter((item) => item.type === 'colors').length, 16);
    assert.equal(initial.data.filter((item) => item.type === 'size').length, 14);
    assert.equal(initial.data.filter((item) => item.type === 'thickness').length, 8);
    assert.ok(initial.data.some((item) => item.colorName === 'Multicolor' && item.colorHex.startsWith('linear-gradient')));
    assert.ok(initial.data.some((item) => item.type === 'size' && item.displayValue === '12X12'));

    const invalidResponse = await request(baseUrl, 'POST', { type: 'size', width: '0', height: '12.123' });
    const invalid = await invalidResponse.json();
    assert.equal(invalidResponse.status, 400);
    assert.ok(invalid.errors.width);
    assert.ok(invalid.errors.height);

    const colorResponse = await request(baseUrl, 'POST', { type: 'colors', colorName: '  Test   Azure  ', colorHex: '#12abef' });
    const color = await colorResponse.json();
    assert.equal(colorResponse.status, 201);
    assert.equal(color.data.colorName, 'Test Azure');
    assert.equal(color.data.colorHex, '#12ABEF');
    createdIds.push(color.data.id);

    const duplicateNameResponse = await request(baseUrl, 'POST', { type: 'colors', colorName: 'test azure', colorHex: '#111111' });
    const duplicateName = await duplicateNameResponse.json();
    assert.equal(duplicateNameResponse.status, 409);
    assert.ok(duplicateName.errors.colorName);

    const updateResponse = await request(baseUrl, 'PUT', { type: 'colors', colorName: 'Test Ocean', colorHex: '#123456' }, color.data.id);
    const updated = await updateResponse.json();
    assert.equal(updateResponse.status, 200);
    assert.equal(updated.data.colorName, 'Test Ocean');

    const sizeResponse = await request(baseUrl, 'POST', { type: 'size', width: '123.45', height: '67.89' });
    const size = await sizeResponse.json();
    assert.equal(sizeResponse.status, 201);
    assert.equal(size.data.displayValue, '123.45×67.89');
    createdIds.push(size.data.id);

    const invalidThicknessResponse = await request(baseUrl, 'POST', { type: 'thickness', thickness: '100.01' });
    const invalidThickness = await invalidThicknessResponse.json();
    assert.equal(invalidThicknessResponse.status, 400);
    assert.ok(invalidThickness.errors.thickness);

    for (const id of [...createdIds]) {
      const deleteResponse = await fetch(`${baseUrl}/${id}`, { method: 'DELETE' });
      assert.equal(deleteResponse.status, 200);
      createdIds.splice(createdIds.indexOf(id), 1);
    }
    await db.initializeDatabase();
    const afterReinitialize = await (await fetch(baseUrl)).json();
    assert.equal(afterReinitialize.data.some((item) => item.colorName === 'Test Ocean'), false);
    assert.equal(afterReinitialize.data.some((item) => item.displayValue === '123.45×67.89'), false);
  } finally {
    for (const id of createdIds) await fetch(`${baseUrl}/${id}`, { method: 'DELETE' }).catch(() => {});
    await new Promise((resolve) => server.close(resolve));
    await db.end();
  }
});
