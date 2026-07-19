const assert = require('node:assert/strict');
const fs = require('fs/promises');
const path = require('path');
const test = require('node:test');

require('dotenv').config();
const app = require('../server');
const db = require('../config/db');

test('managed media endpoints store relative paths and enforce limits', async () => {
  await db.initializeDatabase();
  const source = path.resolve(__dirname, '..', '..', 'frontend', 'src', 'assets', 'images', 'bgimages', 'pro1.jpeg');
  const uploadRoot = path.resolve(__dirname, '..', 'uploads');
  const server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  const baseUrl = `http://127.0.0.1:${server.address().port}/api`;
  let founderPath = '';
  let roomTestPath = '';
  let createdRoomId = null;
  let createdGalleryId = null;
  const galleryLimitFixtureIds = [];

  try {
    const founderGet = await (await fetch(`${baseUrl}/founder-showcase`)).json();
    const roomsGet = await (await fetch(`${baseUrl}/room-designs`)).json();
    assert.equal(founderGet.success, true);
    assert.equal(roomsGet.data.length, 7);

    const bytes = await fs.readFile(source);
    const founderForm = new FormData();
    founderForm.append('portrait', new Blob([bytes], { type: 'image/jpeg' }), 'founder-test.jpeg');
    const founderResponse = await fetch(`${baseUrl}/founder-showcase`, { method: 'PUT', body: founderForm });
    assert.equal(founderResponse.status, 200);
    const [[founderRow]] = await db.query('SELECT portrait FROM founder_showcase WHERE id = 1');
    founderPath = founderRow.portrait;
    assert.match(founderPath, /^uploads\/founder\/.+\.jpeg$/);

    const roomForm = new FormData();
    roomForm.append('title', 'Room Designs');
    roomForm.append('sortOrder', '1');
    roomForm.append('image', new Blob([bytes], { type: 'image/jpeg' }), 'room-test.jpeg');
    const roomResponse = await fetch(`${baseUrl}/room-designs/1`, { method: 'PUT', body: roomForm });
    assert.equal(roomResponse.status, 200);
    const [[roomRow]] = await db.query('SELECT image FROM room_designs WHERE id = 1');
    roomTestPath = roomRow.image;
    assert.match(roomTestPath, /^uploads\/room-designs\/.+\.jpeg$/);

    const createForm = new FormData();
    createForm.append('title', 'Guest Room Designs');
    createForm.append('sortOrder', '2');
    createForm.append('image', new Blob([bytes], { type: 'image/jpeg' }), 'created-room.jpeg');
    const createResponse = await fetch(`${baseUrl}/room-designs`, { method: 'POST', body: createForm });
    const createdRoom = await createResponse.json();
    assert.equal(createResponse.status, 201);
    createdRoomId = createdRoom.data.id;
    assert.equal(createdRoom.data.title, 'Guest Room Designs');
    assert.equal(createdRoom.data.sortOrder, 2);

    const shiftedRooms = await (await fetch(`${baseUrl}/room-designs`)).json();
    assert.equal(shiftedRooms.data[1].id, createdRoomId);
    assert.deepEqual(shiftedRooms.data.map((room) => room.sortOrder), [1, 2, 3, 4, 5, 6, 7, 8]);

    const reorderForm = new FormData();
    reorderForm.append('title', 'Guest Room Designs');
    reorderForm.append('sortOrder', '4');
    const reorderResponse = await fetch(`${baseUrl}/room-designs/${createdRoomId}`, { method: 'PUT', body: reorderForm });
    const reorderedRoom = await reorderResponse.json();
    assert.equal(reorderResponse.status, 200);
    assert.equal(reorderedRoom.data.sortOrder, 4);

    const reorderedRooms = await (await fetch(`${baseUrl}/room-designs`)).json();
    assert.equal(reorderedRooms.data[3].id, createdRoomId);
    assert.deepEqual(reorderedRooms.data.map((room) => room.sortOrder), [1, 2, 3, 4, 5, 6, 7, 8]);

    const invalidTitleForm = new FormData();
    invalidTitleForm.append('title', 'One Two Three Four Five');
    invalidTitleForm.append('sortOrder', '1');
    invalidTitleForm.append('image', new Blob([bytes], { type: 'image/jpeg' }), 'invalid-title.jpeg');
    const invalidTitleResponse = await fetch(`${baseUrl}/room-designs`, { method: 'POST', body: invalidTitleForm });
    assert.equal(invalidTitleResponse.status, 400);

    const invalidOrderForm = new FormData();
    invalidOrderForm.append('title', 'Invalid Order');
    invalidOrderForm.append('sortOrder', '0');
    invalidOrderForm.append('image', new Blob([bytes], { type: 'image/jpeg' }), 'invalid-order.jpeg');
    const invalidOrderResponse = await fetch(`${baseUrl}/room-designs`, { method: 'POST', body: invalidOrderForm });
    assert.equal(invalidOrderResponse.status, 400);

    const deleteResponse = await fetch(`${baseUrl}/room-designs/${createdRoomId}`, { method: 'DELETE' });
    assert.equal(deleteResponse.status, 200);
    createdRoomId = null;

    const compactedRooms = await (await fetch(`${baseUrl}/room-designs`)).json();
    assert.deepEqual(compactedRooms.data.map((room) => room.sortOrder), [1, 2, 3, 4, 5, 6, 7]);

    const oversizedForm = new FormData();
    oversizedForm.append('portrait', new Blob([Buffer.alloc(3 * 1024 * 1024 + 1)], { type: 'image/jpeg' }), 'too-large.jpeg');
    const oversizedResponse = await fetch(`${baseUrl}/founder-showcase`, { method: 'PUT', body: oversizedForm });
    const oversizedPayload = await oversizedResponse.json();
    assert.equal(oversizedResponse.status, 400);
    assert.equal(oversizedPayload.message, 'Image must be 3 MB or smaller.');

    const galleryGet = await (await fetch(`${baseUrl}/gallery`)).json();
    assert.equal(galleryGet.success, true);
    assert.ok(galleryGet.data.length <= 20);

    const galleryForm = new FormData();
    galleryForm.append('title', 'Integration Gallery Item');
    galleryForm.append('image', new Blob([bytes], { type: 'image/jpeg' }), 'gallery-test.jpeg');
    const galleryResponse = await fetch(`${baseUrl}/gallery`, { method: 'POST', body: galleryForm });
    const createdGallery = await galleryResponse.json();
    assert.equal(galleryResponse.status, 201);
    createdGalleryId = createdGallery.data.id;
    assert.equal(createdGallery.data.title, 'Integration Gallery Item');
    const [[galleryRow]] = await db.query('SELECT image FROM gallery_items WHERE id = ?', [createdGalleryId]);
    assert.match(galleryRow.image, /^uploads\/gallery\/.+\.jpeg$/);

    const galleryUpdateForm = new FormData();
    galleryUpdateForm.append('title', 'Updated Gallery Item');
    const galleryUpdateResponse = await fetch(`${baseUrl}/gallery/${createdGalleryId}`, { method: 'PUT', body: galleryUpdateForm });
    const updatedGallery = await galleryUpdateResponse.json();
    assert.equal(galleryUpdateResponse.status, 200);
    assert.equal(updatedGallery.data.title, 'Updated Gallery Item');

    const invalidGalleryForm = new FormData();
    invalidGalleryForm.append('title', 'One Two Three Four Five');
    invalidGalleryForm.append('image', new Blob([bytes], { type: 'image/jpeg' }), 'invalid-gallery.jpeg');
    const invalidGalleryResponse = await fetch(`${baseUrl}/gallery`, { method: 'POST', body: invalidGalleryForm });
    assert.equal(invalidGalleryResponse.status, 400);

    const galleryDeleteResponse = await fetch(`${baseUrl}/gallery/${createdGalleryId}`, { method: 'DELETE' });
    assert.equal(galleryDeleteResponse.status, 200);
    createdGalleryId = null;

    const [[{ currentGalleryCount }]] = await db.query('SELECT COUNT(*) AS currentGalleryCount FROM gallery_items');
    for (let order = Number(currentGalleryCount) + 1; order <= 20; order += 1) {
      const [fixtureResult] = await db.execute(
        `INSERT INTO gallery_items (title, image, category, object_position, filter_state, sort_order)
         VALUES (?, 'uploads/gallery/floor_tiles.png', 'Gallery', 'center', '{}', ?)`,
        [`Limit Fixture ${order}`, order],
      );
      galleryLimitFixtureIds.push(fixtureResult.insertId);
    }

    const overLimitGalleryForm = new FormData();
    overLimitGalleryForm.append('title', 'Over Limit Item');
    overLimitGalleryForm.append('image', new Blob([bytes], { type: 'image/jpeg' }), 'over-limit-gallery.jpeg');
    const overLimitGalleryResponse = await fetch(`${baseUrl}/gallery`, { method: 'POST', body: overLimitGalleryForm });
    const overLimitGalleryPayload = await overLimitGalleryResponse.json();
    assert.equal(overLimitGalleryResponse.status, 409);
    assert.equal(overLimitGalleryPayload.message, 'A maximum of 20 gallery items can be added.');
  } finally {
    if (createdRoomId) await fetch(`${baseUrl}/room-designs/${createdRoomId}`, { method: 'DELETE' }).catch(() => {});
    if (createdGalleryId) await fetch(`${baseUrl}/gallery/${createdGalleryId}`, { method: 'DELETE' }).catch(() => {});
    for (const fixtureId of galleryLimitFixtureIds) await db.execute('DELETE FROM gallery_items WHERE id = ?', [fixtureId]);
    await db.query('UPDATE founder_showcase SET portrait = NULL WHERE id = 1');
    if (founderPath) await fs.unlink(path.resolve(__dirname, '..', founderPath)).catch(() => {});

    const restoredRoomPath = path.join(uploadRoot, 'room-designs', 'room-designs.jpeg');
    await fs.copyFile(source, restoredRoomPath);
    await db.query('UPDATE room_designs SET image = ? WHERE id = 1', ['uploads/room-designs/room-designs.jpeg']);
    if (roomTestPath) await fs.unlink(path.resolve(__dirname, '..', roomTestPath)).catch(() => {});

    await new Promise((resolve) => server.close(resolve));
    await db.end();
  }
});
