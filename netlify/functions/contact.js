const nodemailer = require('nodemailer');

const smtpHost = process.env.SMTP_HOST || 'disroot.org';
const smtpPort = Number(process.env.SMTP_PORT || '465');
const smtpUser = process.env.SMTP_USER || '';
const smtpPass = process.env.SMTP_PASS || '';
const toAddress = process.env.CONTACT_TO || smtpUser;

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  if (!smtpUser || !smtpPass) {
    return { statusCode: 500, body: JSON.stringify({ error: 'SMTP credentials not configured' }) };
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch (e) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const { name = '', email = '', interest = '', message = '' } = body;

  if (!name || !email || !message) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing required fields' }) };
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: true,
    auth: { user: smtpUser, pass: smtpPass },
  });

  const text =
    `New contact form submission from ${name} <${email}>\n\n` +
    `Interested in: ${interest || 'Not specified'}\n\n` +
    `Message:\n${message}`;

  try {
    await transporter.sendMail({
      from: smtpUser,
      to: toAddress,
      replyTo: email,
      subject: `Contact form: ${name}`,
      text,
    });
    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    console.error('SMTP send failed:', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Delivery failed', detail: err.message }) };
  }
};