import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const parseEnv = (content) => {
  const map = new Map();
  content.split(/\r?\n/).forEach((line) => {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (match) {
      map.set(match[1], match[2]);
    }
  });
  return map;
};

test('user_roles row is created for new auth users', async (t) => {
  const envUrl = new URL('../../../.env', import.meta.url);
  if (!fs.existsSync(envUrl)) {
    t.skip('Missing .env (local Supabase not configured)');
    return;
  }

  const env = parseEnv(fs.readFileSync(envUrl, 'utf8'));
  const rawSupabaseUrl = env.get('SUPABASE_URL');
  const supabaseUrl = rawSupabaseUrl?.replace('http://localhost', 'http://127.0.0.1');
  const authBaseUrl = (env.get('SUPABASE_AUTH_URL') || 'http://127.0.0.1:9999').replace(
    'http://localhost',
    'http://127.0.0.1',
  );
  const serviceKey = env.get('SUPABASE_SERVICE_ROLE_KEY');

  if (!supabaseUrl || !serviceKey) {
    t.skip('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    return;
  }

  let healthOk = false;
  try {
    const response = await fetch(`${authBaseUrl}/health`);
    healthOk = response.ok;
  } catch {
    healthOk = false;
  }

  if (!healthOk) {
    t.skip('Local Supabase Auth is not running');
    return;
  }

  const email = `roles-trigger-${Date.now()}@local.test`;
  const password = 'localpass123!';

  const createResponse = await fetch(`${authBaseUrl}/admin/users`, {
    method: 'POST',
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password, email_confirm: true }),
  });

  if (!createResponse.ok) {
    const detail = await createResponse.text();
    throw new Error(`Failed to create user (${createResponse.status}): ${detail}`);
  }

  const created = await createResponse.json();
  const userId = created.id;
  assert.equal(typeof userId, 'string');
  assert.ok(userId.length > 0);

  try {
    const rolesResponse = await fetch(
      `${supabaseUrl}/rest/v1/user_roles?user_id=eq.${userId}&select=user_id,roles`,
      {
        headers: {
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
        },
      },
    );

    if (!rolesResponse.ok) {
      const detail = await rolesResponse.text();
      throw new Error(`Failed to read user_roles (${rolesResponse.status}): ${detail}`);
    }

    const rows = await rolesResponse.json();
    assert.ok(Array.isArray(rows));
    assert.equal(rows.length, 1);
    assert.equal(rows[0].user_id, userId);
    assert.ok(Array.isArray(rows[0].roles));
  } finally {
    await fetch(`${authBaseUrl}/admin/users/${userId}`, {
      method: 'DELETE',
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
      },
    }).catch(() => null);
  }
});
