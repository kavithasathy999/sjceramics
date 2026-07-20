const assert = require('node:assert/strict');
const test = require('node:test');

require('dotenv').config();
const app = require('../server');
const db = require('../config/db');

const createForm = ({
  title,
  category = 'Tiles',
  author = 'Test Author',
  date = '2020-07-20',
  description = 'A concise integration test description.',
  bytes,
  type,
  filename,
}) => {
  const form = new FormData();
  form.append('category', category);
  form.append('title', title);
  form.append('author', author);
  form.append('date', date);
  form.append('description', description);
  if (bytes) form.append('media', new Blob([bytes], { type }), filename);
  return form;
};

test('blogs CRUD preserves seeded content and enforces word and media limits', async () => {
  await db.initializeDatabase();
  const server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  const baseUrl = `http://127.0.0.1:${server.address().port}/api/blogs`;
  const createdIds = [];

  try {
    const listResponse = await fetch(baseUrl);
    const listPayload = await listResponse.json();
    assert.equal(listResponse.status, 200);
    assert.equal(listPayload.success, true);
    assert.ok(listPayload.data.length >= 5);
    assert.equal(listPayload.data[0].title, 'A Guide to Selecting Modern Bath Fittings and Faucets');

    const exactImageResponse = await fetch(baseUrl, {
      method: 'POST',
      body: createForm({ title: `Exact Image ${Date.now()}`, bytes: Buffer.alloc(3 * 1024 * 1024), type: 'image/jpeg', filename: 'exact.jpeg' }),
    });
    const exactImage = await exactImageResponse.json();
    assert.equal(exactImageResponse.status, 201);
    assert.equal(exactImage.data.mediaType, 'image');
    assert.equal(exactImage.data.category, 'Tiles');
    assert.equal(exactImage.data.author, 'Test Author');
    assert.equal(exactImage.data.date, '20 July 2020');
    createdIds.push(exactImage.data.id);

    const imageTooLargeResponse = await fetch(baseUrl, {
      method: 'POST',
      body: createForm({ title: `Large Image ${Date.now()}`, bytes: Buffer.alloc(3 * 1024 * 1024 + 1), type: 'image/png', filename: 'large.png' }),
    });
    assert.equal(imageTooLargeResponse.status, 400);
    assert.equal((await imageTooLargeResponse.json()).errors.media, 'Image must be 3 MB or smaller.');

    const exactVideoResponse = await fetch(baseUrl, {
      method: 'POST',
      body: createForm({ title: `Exact Video ${Date.now()}`, bytes: Buffer.alloc(8 * 1024 * 1024), type: 'video/mp4', filename: 'exact.mp4' }),
    });
    const exactVideo = await exactVideoResponse.json();
    assert.equal(exactVideoResponse.status, 201);
    assert.equal(exactVideo.data.mediaType, 'video');
    createdIds.push(exactVideo.data.id);

    const videoTooLargeResponse = await fetch(baseUrl, {
      method: 'POST',
      body: createForm({ title: `Large Video ${Date.now()}`, bytes: Buffer.alloc(8 * 1024 * 1024 + 1), type: 'video/webm', filename: 'large.webm' }),
    });
    assert.equal(videoTooLargeResponse.status, 400);

    const longTitleResponse = await fetch(baseUrl, {
      method: 'POST',
      body: createForm({ title: 'One two three four five six seven eight nine ten eleven twelve thirteen', bytes: Buffer.from('image'), type: 'image/jpeg', filename: 'title.jpeg' }),
    });
    assert.equal(longTitleResponse.status, 400);
    assert.equal((await longTitleResponse.json()).errors.title, 'Title must contain 12 words or fewer.');

    const longDescriptionResponse = await fetch(baseUrl, {
      method: 'POST',
      body: createForm({ title: `Long Description ${Date.now()}`, description: Array(501).fill('word').join(' '), bytes: Buffer.from('image'), type: 'image/jpeg', filename: 'description.jpeg' }),
    });
    assert.equal(longDescriptionResponse.status, 400);
    assert.equal((await longDescriptionResponse.json()).errors.description, 'Description must contain 500 words or fewer.');

    const invalidCategoryResponse = await fetch(baseUrl, {
      method: 'POST',
      body: createForm({ title: `Invalid Category ${Date.now()}`, category: 'Furniture', bytes: Buffer.from('image'), type: 'image/jpeg', filename: 'category.jpeg' }),
    });
    assert.equal(invalidCategoryResponse.status, 400);
    assert.equal((await invalidCategoryResponse.json()).errors.category, 'Select a valid category.');

    const invalidAuthorResponse = await fetch(baseUrl, {
      method: 'POST',
      body: createForm({ title: `Invalid Author ${Date.now()}`, author: 'Author 123', bytes: Buffer.from('image'), type: 'image/jpeg', filename: 'author.jpeg' }),
    });
    assert.equal(invalidAuthorResponse.status, 400);
    assert.equal((await invalidAuthorResponse.json()).errors.author, 'Use only letters, spaces, periods, apostrophes, or hyphens.');

    const futureDateResponse = await fetch(baseUrl, {
      method: 'POST',
      body: createForm({ title: `Future Date ${Date.now()}`, date: '2999-01-01', bytes: Buffer.from('image'), type: 'image/jpeg', filename: 'date.jpeg' }),
    });
    assert.equal(futureDateResponse.status, 400);
    assert.equal((await futureDateResponse.json()).errors.date, 'Blog date cannot be in the future.');

    const updateForm = new FormData();
    updateForm.append('category', 'Bath Fittings');
    updateForm.append('title', `Updated Blog ${Date.now()}`);
    updateForm.append('author', "D'Arcy Ceramics");
    updateForm.append('date', '2021-08-21');
    updateForm.append('description', 'Updated description without replacing the existing media.');
    const updateResponse = await fetch(`${baseUrl}/${exactImage.data.id}`, { method: 'PUT', body: updateForm });
    const updated = await updateResponse.json();
    assert.equal(updateResponse.status, 200);
    assert.equal(updated.data.mediaType, 'image');
    assert.equal(updated.data.category, 'Bath Fittings');
    assert.equal(updated.data.author, "D'Arcy Ceramics");
    assert.equal(updated.data.date, '21 August 2021');
  } finally {
    for (const id of createdIds) await fetch(`${baseUrl}/${id}`, { method: 'DELETE' }).catch(() => {});
    await new Promise((resolve) => server.close(resolve));
    await db.end();
  }
});
