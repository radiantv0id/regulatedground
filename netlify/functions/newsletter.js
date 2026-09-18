const BREVO_API = 'https://api.brevo.com/v3/contacts';

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch (e) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const email = (body.email || '').trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid email' }) };
  }

  const apiKey = process.env.BREVO_API_KEY;
  const listIds = (process.env.BREVO_LIST_ID || '').split(',').filter(Boolean).map((id) => Number(id.trim()));

  if (!apiKey || !listIds.length) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Newsletter not configured' }) };
  }

  const payload = {
    email,
    listIds,
    updateEnabled: true
  };

  try {
    const res = await fetch(BREVO_API, {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (res.status === 201 || res.status === 204) {
      return { statusCode: 200, body: JSON.stringify({ ok: true }) };
    }

    const detail = await res.text();
    console.error('Brevo create contact failed:', res.status, detail);
    return { statusCode: 502, body: JSON.stringify({ error: 'Newsletter service error', detail }) };
  } catch (err) {
    console.error('Brevo request failed:', err);
    return { statusCode: 502, body: JSON.stringify({ error: 'Newsletter service error' }) };
  }
};