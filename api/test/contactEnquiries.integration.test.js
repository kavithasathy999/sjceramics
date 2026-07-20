const assert = require('node:assert/strict');
const test = require('node:test');

require('dotenv').config();
process.env.SMTP_HOST = 'localhost';
process.env.SMTP_PORT = '587';
process.env.SMTP_SECURE = 'false';
process.env.SMTP_USER = 'mailer@test.local';
process.env.SMTP_PASS = 'test-password';
process.env.SMTP_FROM_NAME = 'SJ Ceramics';
process.env.SMTP_FROM_EMAIL = 'mailer@test.local';
process.env.CONTACT_ADMIN_EMAIL = 'aryastm195@gmail.com';

const app = require('../server');
const db = require('../config/db');
const { sendContactEmails, setTransportFactoryForTests, resetTransportFactoryForTests } = require('../services/contactEmailService');

const request = (baseUrl, method, body, id = '') => fetch(`${baseUrl}${id ? `/${id}` : ''}`, {
  method,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});

test('contact enquiries persist, support dashboard CRUD, and send separate emails with filename-free inline logos', async () => {
  await db.initializeDatabase();
  const sentMessages = [];
  setTransportFactoryForTests(() => ({ sendMail: async (message) => { sentMessages.push(message); return { messageId: String(sentMessages.length) }; } }));
  const server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  const baseUrl = `http://127.0.0.1:${server.address().port}/api/contact-enquiries`;
  let createdId;

  try {
    const invalidResponse = await request(baseUrl, 'POST', { fullName: 'User 123', email: 'invalid', phone: '123', message: 'Hi' });
    const invalid = await invalidResponse.json();
    assert.equal(invalidResponse.status, 400);
    assert.ok(invalid.errors.fullName);
    assert.ok(invalid.errors.email);
    assert.ok(invalid.errors.phone);
    assert.ok(invalid.errors.message);
    assert.equal(sentMessages.length, 0);

    const validResponse = await request(baseUrl, 'POST', {
      fullName: "  Meera   D'Souza  ",
      email: 'MEERA@example.com',
      phone: '9876543210',
      message: 'Please share details about your premium bathroom tile collection.',
    });
    const valid = await validResponse.json();
    assert.equal(validResponse.status, 201);
    assert.equal(valid.success, true);
    assert.equal(valid.reference, undefined);
    assert.equal(valid.data.email, 'meera@example.com');
    createdId = valid.data.id;
    assert.equal(sentMessages.length, 2);

    const adminEmail = sentMessages.find((message) => message.to === 'aryastm195@gmail.com');
    const userEmail = sentMessages.find((message) => message.to === 'meera@example.com');
    assert.ok(adminEmail);
    assert.ok(userEmail);
    assert.equal(adminEmail.replyTo, 'meera@example.com');
    assert.equal(adminEmail.cc, undefined);
    assert.equal(adminEmail.bcc, undefined);
    assert.equal(userEmail.cc, undefined);
    assert.equal(userEmail.bcc, undefined);
    assert.equal(adminEmail.attachments.length, 2);
    assert.equal(userEmail.attachments.length, 2);
    for (const email of [adminEmail, userEmail]) {
      assert.deepEqual(email.attachments.map((attachment) => attachment.cid), ['sj-ceramics-logo', 'kag-logo']);
      assert.ok(email.attachments.every((attachment) => attachment.filename === false));
      assert.ok(email.attachments.every((attachment) => attachment.contentDisposition === 'inline'));
      assert.ok(email.attachments.every((attachment) => attachment.contentType === 'image/png'));
    }
    assert.doesNotMatch(adminEmail.html, /Reference/);
    assert.doesNotMatch(userEmail.html, /Reference/);
    assert.ok(adminEmail.html.indexOf('Message') < adminEmail.html.indexOf('Submitted'));
    assert.match(userEmail.subject, /Thank You for Contacting SJ Ceramics/);
    assert.match(userEmail.html, /Thank you for contacting SJ Ceramics/);
    assert.match(adminEmail.html, /cid:sj-ceramics-logo/);
    assert.match(adminEmail.html, /cid:kag-logo/);

    const deliveryCountBeforeSameAddress = sentMessages.length;
    await sendContactEmails({
      fullName: 'Admin Customer',
      email: 'ARYASTM195@GMAIL.COM',
      phone: '9876543210',
      message: 'Please share the latest product catalogue details.',
      submittedAt: new Date(),
    });
    const sameAddressMessages = sentMessages.slice(deliveryCountBeforeSameAddress);
    assert.equal(sameAddressMessages.length, 1);
    assert.equal(sameAddressMessages[0].to, 'aryastm195@gmail.com');
    assert.match(sameAddressMessages[0].subject, /New Website Enquiry/);
    assert.doesNotMatch(sameAddressMessages[0].subject, /Thank You/);

    const listResponse = await fetch(baseUrl);
    const list = await listResponse.json();
    assert.equal(listResponse.status, 200);
    assert.ok(list.data.some((item) => item.id === createdId));

    const updateResponse = await request(baseUrl, 'PUT', {
      fullName: "Meera D'Souza",
      email: 'customer@example.com',
      phone: '9876543210',
      message: 'Please share the latest premium bathroom tile catalogue.',
    }, createdId);
    const updated = await updateResponse.json();
    assert.equal(updateResponse.status, 200);
    assert.equal(updated.data.email, 'customer@example.com');

    const deleteResponse = await fetch(`${baseUrl}/${createdId}`, { method: 'DELETE' });
    assert.equal(deleteResponse.status, 200);
    createdId = null;
  } finally {
    if (createdId) await fetch(`${baseUrl}/${createdId}`, { method: 'DELETE' }).catch(() => {});
    resetTransportFactoryForTests();
    await new Promise((resolve) => server.close(resolve));
    await db.end();
  }
});
