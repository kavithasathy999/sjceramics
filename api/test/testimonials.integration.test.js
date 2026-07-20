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

test('testimonials CRUD seeds static content and validates managed fields', async () => {
  await db.initializeDatabase();
  const server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  const baseUrl = `http://127.0.0.1:${server.address().port}/api/testimonials`;
  let createdId;

  try {
    const listResponse = await fetch(baseUrl);
    const listPayload = await listResponse.json();
    assert.equal(listResponse.status, 200);
    assert.equal(listPayload.success, true);
    assert.ok(listPayload.data.length >= 3);
    assert.equal(listPayload.data[0].customerName, 'Anan Hanona');
    assert.equal(listPayload.data[0].starRating, 5);

    const createResponse = await request(baseUrl, 'POST', {
      customerName: '  Meera   D\'Souza  ',
      designation: 'Architect & Customer',
      description: 'Excellent product quality and thoughtful service throughout our renovation project.',
      starRating: 4,
    });
    const created = await createResponse.json();
    assert.equal(createResponse.status, 201);
    assert.equal(created.data.customerName, "Meera D'Souza");
    assert.equal(created.data.starRating, 4);
    createdId = created.data.id;

    const invalidResponse = await request(baseUrl, 'POST', {
      customerName: 'Customer 123',
      designation: '<script>',
      description: 'Too short',
      starRating: 6,
    });
    const invalid = await invalidResponse.json();
    assert.equal(invalidResponse.status, 400);
    assert.ok(invalid.errors.customerName);
    assert.ok(invalid.errors.designation);
    assert.ok(invalid.errors.description);
    assert.ok(invalid.errors.starRating);

    const updateResponse = await request(baseUrl, 'PUT', {
      customerName: 'Meera D\'Souza',
      designation: 'Lead Architect',
      description: 'The updated showroom experience was smooth, informative, and genuinely helpful.',
      starRating: 5,
    }, createdId);
    const updated = await updateResponse.json();
    assert.equal(updateResponse.status, 200);
    assert.equal(updated.data.designation, 'Lead Architect');
    assert.equal(updated.data.starRating, 5);

    const deleteResponse = await fetch(`${baseUrl}/${createdId}`, { method: 'DELETE' });
    assert.equal(deleteResponse.status, 200);
    createdId = null;
  } finally {
    if (createdId) await fetch(`${baseUrl}/${createdId}`, { method: 'DELETE' }).catch(() => {});
    await new Promise((resolve) => server.close(resolve));
    await db.end();
  }
});
