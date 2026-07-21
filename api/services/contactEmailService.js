const fs = require('fs');
const path = require('path');
const dns = require('dns/promises');
const nodemailer = require('nodemailer');

const BRAND_RED = '#dd2328';
const BRAND_BLACK = '#231f1c';
const ADMIN_EMAIL = process.env.CONTACT_ADMIN_EMAIL || 'aryastm195@gmail.com';
const sjLogoPath = path.resolve(__dirname, '..', '..', 'frontend', 'public', 'Logo_Png.png');
const kagLogoPath = path.resolve(__dirname, '..', '..', 'frontend', 'src', 'assets', 'images', 'kaglogo.svg');
let transportFactory = (configuration) => nodemailer.createTransport(configuration);

const recipientKey = (value) => String(value).trim().toLowerCase();

const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;',
}[character]));
const safeHeader = (value) => String(value).replace(/[\r\n]+/g, ' ').trim();
const messageHtml = (value) => escapeHtml(value).replace(/\n/g, '<br>');
const submittedTime = (value) => new Intl.DateTimeFormat('en-IN', {
  dateStyle: 'long', timeStyle: 'short', timeZone: 'Asia/Kolkata',
}).format(new Date(value));

const emailShell = ({ preheader, heading, intro, details = '', closing }) => `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escapeHtml(heading)}</title>
<style>@media only screen and (max-width:620px){.email-container{width:100%!important}.brand-cell{display:block!important;width:100%!important;padding:14px 10px!important;border-right:0!important}.content-pad{padding:26px 20px!important}.detail-label{display:block!important;width:100%!important;padding-bottom:4px!important}.detail-value{display:block!important;width:100%!important}}</style></head>
<body style="margin:0;padding:0;background:#f5f3f1;color:${BRAND_BLACK};font-family:Arial,'Noto Sans Tamil','Latha',sans-serif;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preheader)}</div>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f5f3f1;"><tr><td align="center" style="padding:28px 12px;">
<table role="presentation" class="email-container" width="600" cellspacing="0" cellpadding="0" border="0" style="width:600px;max-width:600px;background:#fff;border-top:5px solid ${BRAND_RED};border-radius:10px;overflow:hidden;box-shadow:0 8px 28px rgba(35,31,28,.08);">
<tr><td style="padding:22px 24px;border-bottom:1px solid #eee9e6;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"><tr>
    <td class="brand-cell" width="43%" align="center" valign="middle" style="padding:8px 18px;border-right:1px solid #eee9e6;"><img src="cid:sj-ceramics-logo" width="155" alt="SJ Ceramics" style="display:block;width:155px;max-width:100%;height:auto;margin:auto;"></td>
    <td class="brand-cell" width="57%" align="center" valign="middle" style="padding:8px 18px;"><img src="cid:kag-logo" width="150" alt="KAG Tiles" style="display:block;width:150px;max-width:100%;height:auto;margin:0 auto 9px;"><div style="color:${BRAND_RED};font-size:14px;font-weight:700;line-height:1.5;">இது &quot;பேரல்ல, பெருமை&quot;</div><div style="margin-top:3px;color:${BRAND_BLACK};font-size:11px;font-weight:700;line-height:1.45;letter-spacing:.35px;text-transform:uppercase;">We Are Authorized Channel Partner</div></td>
  </tr></table>
</td></tr>
<tr><td class="content-pad" style="padding:34px 38px;">
  <div style="display:inline-block;margin-bottom:13px;padding:6px 10px;color:${BRAND_RED};background:#fff1f1;border-radius:20px;font-size:11px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;">SJ Ceramics</div>
  <h1 style="margin:0 0 14px;color:${BRAND_BLACK};font-size:25px;line-height:1.25;">${escapeHtml(heading)}</h1>
  <div style="margin:0 0 24px;color:${BRAND_BLACK};font-size:14px;line-height:1.7;">${intro}</div>
  ${details ? `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border:1px solid #eee5e1;border-radius:8px;border-collapse:separate;overflow:hidden;">${details}</table>` : ''}
  <div style="margin-top:24px;color:${BRAND_BLACK};font-size:13px;line-height:1.7;">${closing}</div>
</td></tr>
<tr><td align="center" style="padding:20px 24px;background:${BRAND_BLACK};color:#fff;font-size:11px;line-height:1.7;">SJ Ceramics · Premium Tiles, Sanitary Wares &amp; Bath Fittings<br><a href="mailto:sales@sjceramics.in" style="color:#fff;text-decoration:underline;">sales@sjceramics.in</a> · +91 93841 05222</td></tr>
</table></td></tr></table></body></html>`;

const detailRow = (label, value) => `<tr><td class="detail-label" width="34%" valign="top" style="padding:11px 14px;border-bottom:1px solid #eee5e1;color:${BRAND_BLACK};background:#faf8f7;font-size:12px;font-weight:700;">${escapeHtml(label)}</td><td class="detail-value" valign="top" style="padding:11px 14px;border-bottom:1px solid #eee5e1;color:${BRAND_BLACK};font-size:13px;line-height:1.6;overflow-wrap:anywhere;">${value}</td></tr>`;
const listValue = (items) => items.filter(Boolean).map(escapeHtml).join('<br>');

const adminTemplate = (enquiry) => ({
  subject: `New Website Enquiry - ${safeHeader(enquiry.fullName)}`,
  html: emailShell({
    preheader: 'A new customer enquiry has been submitted.',
    heading: 'New Website Enquiry',
    intro: 'A customer has submitted the following details through the SJ Ceramics contact form.',
    details: [
      detailRow('Customer Name', escapeHtml(enquiry.fullName)),
      detailRow('Email Address', `<a href="mailto:${escapeHtml(enquiry.email)}" style="color:${BRAND_RED};">${escapeHtml(enquiry.email)}</a>`),
      detailRow('Mobile Number', `<a href="tel:${escapeHtml(enquiry.phone)}" style="color:${BRAND_RED};">${escapeHtml(enquiry.phone)}</a>`),
      detailRow('Message', messageHtml(enquiry.message)),
      detailRow('Submitted', escapeHtml(submittedTime(enquiry.submittedAt))),
    ].join(''),
    closing: 'Please respond to this enquiry at your earliest convenience.',
  }),
  text: `SJ Ceramics\nஇது "பேரல்ல, பெருமை"\nWe Are Authorized Channel Partner\n\nNEW WEBSITE ENQUIRY\nCustomer Name: ${enquiry.fullName}\nEmail: ${enquiry.email}\nMobile: ${enquiry.phone}\nMessage: ${enquiry.message}\nSubmitted: ${submittedTime(enquiry.submittedAt)}`,
});

const userTemplate = (enquiry) => ({
  subject: 'Thank You for Contacting SJ Ceramics',
  html: emailShell({
    preheader: 'Thank you for contacting SJ Ceramics.',
    heading: 'Thank You for Contacting Us',
    intro: `Dear <strong>${escapeHtml(enquiry.fullName)}</strong>,<br><br>Thank you for contacting SJ Ceramics. We have successfully received your enquiry.`,
    closing: 'Our team will review your message and get in touch with you shortly. If your enquiry is urgent, please call <strong>+91 93841 05222</strong> or email <a href="mailto:sales@sjceramics.in" style="color:#dd2328;">sales@sjceramics.in</a>.<br><br>Warm regards,<br><strong>SJ Ceramics Team</strong>',
  }),
  text: `Dear ${enquiry.fullName},\n\nThank you for contacting SJ Ceramics. We have successfully received your enquiry. Our team will review your message and get in touch with you shortly.\n\nWarm regards,\nSJ Ceramics Team`,
});

const smtpConfiguration = async () => {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const fromEmail = process.env.SMTP_FROM_EMAIL || user;
  if (!host || !user || !pass || !fromEmail) {
    const error = new Error('SMTP_HOST, SMTP_USER, SMTP_PASS, and SMTP_FROM_EMAIL must be configured.');
    error.code = 'SMTP_CONFIGURATION_MISSING';
    throw error;
  }
  let connectionHost = host;
  try {
    const resolved = await dns.lookup(host, { family: 4 });
    connectionHost = resolved.address;
  } catch (error) {
    console.warn(`SMTP system DNS lookup failed (${error.code || error.message}); using the configured hostname.`);
  }
  return {
    transport: {
      host: connectionHost,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: String(process.env.SMTP_SECURE).toLowerCase() === 'true',
      auth: { user, pass },
      tls: { servername: host },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 20000,
    },
    from: `"${safeHeader(process.env.SMTP_FROM_NAME || 'SJ Ceramics')}" <${safeHeader(fromEmail)}>`,
  };
};

let cachedKagLogo;
const kagLogoPng = () => {
  if (cachedKagLogo) return cachedKagLogo;
  const svg = fs.readFileSync(kagLogoPath, 'utf8');
  const embeddedImage = svg.match(/xlink:href="data:image\/png;base64,([^"]+)"/);
  if (!embeddedImage) throw new Error('KAG logo does not contain an embedded PNG image.');
  cachedKagLogo = Buffer.from(embeddedImage[1], 'base64');
  return cachedKagLogo;
};

const inlineLogos = () => [
  {
    filename: false,
    path: sjLogoPath,
    cid: 'sj-ceramics-logo',
    contentType: 'image/png',
    contentDisposition: 'inline',
  },
  {
    filename: false,
    content: kagLogoPng(),
    cid: 'kag-logo',
    contentType: 'image/png',
    contentDisposition: 'inline',
  },
];

const sendContactEmails = async (enquiry) => {
  const configuration = await smtpConfiguration();
  const transporter = transportFactory(configuration.transport);
  const admin = adminTemplate(enquiry);
  if (recipientKey(enquiry.email) !== recipientKey(ADMIN_EMAIL)) {
    const user = userTemplate(enquiry);
    await transporter.sendMail({ ...user, from: configuration.from, to: enquiry.email, replyTo: configuration.from, attachments: inlineLogos() });
  }
  await transporter.sendMail({ ...admin, from: configuration.from, to: ADMIN_EMAIL, replyTo: enquiry.email, attachments: inlineLogos() });
};

const enquiryLabel = (type) => ({
  contact: 'Website Enquiry',
  service: 'Service Enquiry',
  product: 'Product Enquiry',
}[type] || 'Website Enquiry');

const contactDetails = (enquiry) => [
  detailRow('Customer Name', escapeHtml(enquiry.fullName)),
  detailRow('Email Address', `<a href="mailto:${escapeHtml(enquiry.email)}" style="color:${BRAND_RED};">${escapeHtml(enquiry.email)}</a>`),
  detailRow('Mobile Number', `<a href="tel:${escapeHtml(enquiry.phone)}" style="color:${BRAND_RED};">${escapeHtml(enquiry.phone)}</a>`),
  detailRow('Address', listValue([enquiry.address1, enquiry.address2, enquiry.city, enquiry.state])),
];

const productPreferencesDetails = (rows = []) => rows.map((row, index) => (
  `Preference ${index + 1}: ${[
    row.productType && `Product Type - ${row.productType}`,
    row.whereToUse && `Where to Use - ${row.whereToUse}`,
    row.tileSize && `Tile Size - ${row.tileSize}`,
    row.roomLength && `Room Length - ${row.roomLength} ft`,
    row.roomWidth && `Room Width - ${row.roomWidth} ft`,
  ].filter(Boolean).join(', ')}`
));

const adminEnquiryTemplate = (enquiry) => {
  const label = enquiryLabel(enquiry.type);
  const extraRows = [];
  if (enquiry.type === 'contact') {
    extraRows.push(
      detailRow('Preference', escapeHtml(enquiry.preference)),
      detailRow('Product Preferences', listValue(productPreferencesDetails(enquiry.productPreferences))),
      detailRow('Interested In', messageHtml(enquiry.interest)),
    );
  }
  if (enquiry.type === 'service') {
    extraRows.push(
      detailRow('Source Service', escapeHtml(enquiry.sourceService || 'Website')),
      detailRow('Room Type', escapeHtml(enquiry.roomType)),
      detailRow('Area', `${escapeHtml(enquiry.areaSqFt)} sq.ft`),
      detailRow('Boxes Required', escapeHtml(enquiry.boxesRequired)),
      detailRow('Tile Type', escapeHtml(enquiry.tileType)),
      detailRow('Message', messageHtml(enquiry.message)),
    );
  }
  if (enquiry.type === 'product') {
    extraRows.push(
      detailRow('Product Name', escapeHtml(enquiry.productName)),
      detailRow('Category', escapeHtml(enquiry.category || '')),
      detailRow('Brand', escapeHtml(enquiry.brand || '')),
      detailRow('Size', escapeHtml(enquiry.size || '')),
      detailRow('Type', escapeHtml(enquiry.productType || enquiry.typeValue || '')),
      detailRow('Material', escapeHtml(enquiry.material || '')),
      detailRow('Finish', escapeHtml(enquiry.finish || '')),
      detailRow('Where to Use', escapeHtml(enquiry.whereToUse || '')),
      detailRow('Price Details', listValue([
        enquiry.mrp ? `MRP - Rs. ${enquiry.mrp}` : '',
        enquiry.offerPrice ? `Offer Price - Rs. ${enquiry.offerPrice}` : '',
        enquiry.arrivalStatus ? `Arrival Status - ${enquiry.arrivalStatus}` : '',
      ])),
      detailRow('Message', messageHtml(enquiry.message)),
    );
  }
  return {
    subject: `New ${label} - ${safeHeader(enquiry.fullName)}`,
    html: emailShell({
      preheader: `A new ${label.toLowerCase()} has been submitted.`,
      heading: `New ${label}`,
      intro: `A customer has submitted the following details through the SJ Ceramics ${label.toLowerCase()} form.`,
      details: [
        ...contactDetails(enquiry),
        ...extraRows,
        detailRow('Submitted', escapeHtml(submittedTime(enquiry.submittedAt))),
      ].join(''),
      closing: 'Please respond to this enquiry at your earliest convenience.',
    }),
    text: `SJ Ceramics\n\nNEW ${label.toUpperCase()}\nCustomer: ${enquiry.fullName}\nEmail: ${enquiry.email}\nMobile: ${enquiry.phone}\nSubmitted: ${submittedTime(enquiry.submittedAt)}`,
  };
};

const userEnquiryTemplate = (enquiry) => {
  const label = enquiryLabel(enquiry.type).toLowerCase();
  return {
    subject: 'Thank You for Contacting SJ Ceramics',
    html: emailShell({
      preheader: 'Thank you for contacting SJ Ceramics.',
      heading: 'Thank You for Contacting Us',
      intro: `Dear <strong>${escapeHtml(enquiry.fullName)}</strong>,<br><br>Thank you for contacting SJ Ceramics. We have successfully received your ${escapeHtml(label)}.`,
      closing: 'Our team will review your request and get in touch with you shortly. If your enquiry is urgent, please call <strong>+91 93841 05222</strong> or email <a href="mailto:sales@sjceramics.in" style="color:#dd2328;">sales@sjceramics.in</a>.<br><br>Warm regards,<br><strong>SJ Ceramics Team</strong>',
    }),
    text: `Dear ${enquiry.fullName},\n\nThank you for contacting SJ Ceramics. We have successfully received your ${label}.\n\nWarm regards,\nSJ Ceramics Team`,
  };
};

const sendEnquiryEmails = async (enquiry) => {
  const configuration = await smtpConfiguration();
  const transporter = transportFactory(configuration.transport);
  if (recipientKey(enquiry.email) !== recipientKey(ADMIN_EMAIL)) {
    const user = userEnquiryTemplate(enquiry);
    await transporter.sendMail({ ...user, from: configuration.from, to: enquiry.email, replyTo: configuration.from, attachments: inlineLogos() });
  }
  const admin = adminEnquiryTemplate(enquiry);
  await transporter.sendMail({ ...admin, from: configuration.from, to: ADMIN_EMAIL, replyTo: enquiry.email, attachments: inlineLogos() });
};

const setTransportFactoryForTests = (factory) => { transportFactory = factory; };
const resetTransportFactoryForTests = () => { transportFactory = (configuration) => nodemailer.createTransport(configuration); };

module.exports = { sendContactEmails, sendEnquiryEmails, adminTemplate, userTemplate, adminEnquiryTemplate, userEnquiryTemplate, setTransportFactoryForTests, resetTransportFactoryForTests };
