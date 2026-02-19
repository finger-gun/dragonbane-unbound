import fs from 'fs';

const envPath = '.env';

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

if (!fs.existsSync(envPath)) {
  console.error('Missing .env. Run: pnpm supabase:init');
  process.exit(1);
}

const env = parseEnv(fs.readFileSync(envPath, 'utf8'));
const rawSupabaseUrl = env.get('SUPABASE_URL');
const supabaseUrl = rawSupabaseUrl?.replace('http://localhost', 'http://127.0.0.1');
const authBaseUrl = (env.get('SUPABASE_AUTH_URL') || 'http://127.0.0.1:9999').replace(
  'http://localhost',
  'http://127.0.0.1',
);
const anonKey = env.get('SUPABASE_ANON_KEY');
const apiPort = env.get('API_PORT') || '4000';
const apiBase = process.env.API_BASE_URL || env.get('API_BASE_URL') || `http://localhost:${apiPort}`;

if (!supabaseUrl || !anonKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_ANON_KEY in .env');
  process.exit(1);
}

const getValue = (key, fallback) => env.get(key) || fallback;

const users = [
  {
    label: 'admin',
    email: getValue('SEED_ADMIN_EMAIL', 'admin@local.test'),
    password: getValue('SEED_ADMIN_PASSWORD', 'localpass123!'),
    expects: { admin: true, gm: false },
  },
  {
    label: 'player',
    email: getValue('SEED_PLAYER_EMAIL', 'player@local.test'),
    password: getValue('SEED_PLAYER_PASSWORD', 'localpass123!'),
    expects: { admin: false, gm: false },
  },
  {
    label: 'game-master',
    email: getValue('SEED_GM_EMAIL', 'gm@local.test'),
    password: getValue('SEED_GM_PASSWORD', 'localpass123!'),
    expects: { admin: false, gm: true },
  },
  {
    label: 'super',
    email: getValue('SEED_SUPER_EMAIL', 'super@local.test'),
    password: getValue('SEED_SUPER_PASSWORD', 'localpass123!'),
    expects: { admin: true, gm: true },
  },
];

const waitForAuth = async () => {
  const maxAttempts = 10;
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const response = await fetch(`${authBaseUrl}/health`);
      if (response.ok) {
        return;
      }
    } catch (error) {
      // ignore until next retry
    }
    // eslint-disable-next-line no-await-in-loop
    await new Promise((resolve) => setTimeout(resolve, 500 * attempt));
  }
  throw new Error('Auth service is not responding on /health');
};

const signIn = async (email, password) => {
  const response = await fetch(`${authBaseUrl}/token?grant_type=password`, {
    method: 'POST',
    headers: {
      apikey: anonKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Sign-in failed (${response.status}): ${detail}`);
  }

  return response.json();
};

const signOut = async (accessToken) => {
  const response = await fetch(`${authBaseUrl}/logout`, {
    method: 'POST',
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok && response.status !== 204) {
    const detail = await response.text();
    throw new Error(`Logout failed (${response.status}): ${detail}`);
  }
};

const waitForApi = async () => {
  const maxAttempts = 5;
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const response = await fetch(`${apiBase}/health`);
      if (response.ok) {
        return;
      }
    } catch (error) {
      // ignore until next retry
    }
    // eslint-disable-next-line no-await-in-loop
    await new Promise((resolve) => setTimeout(resolve, 400 * attempt));
  }
  throw new Error(`API is not responding at ${apiBase}`);
};

const apiCheck = async (path, accessToken) => {
  const response = await fetch(`${apiBase}${path}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.status;
};

let failed = false;

console.log('Verifying auth/session baseline...');
await waitForAuth();
await waitForApi();

for (const user of users) {
  try {
    // eslint-disable-next-line no-await-in-loop
    const session = await signIn(user.email, user.password);
    const accessToken = session.access_token;

    if (!accessToken) {
      throw new Error('Missing access token');
    }

    // eslint-disable-next-line no-await-in-loop
    const meStatus = await apiCheck('/me', accessToken);
    if (meStatus !== 200) {
      throw new Error(`/me returned ${meStatus}`);
    }

    // eslint-disable-next-line no-await-in-loop
    const adminStatus = await apiCheck('/admin/ping', accessToken);
    const gmStatus = await apiCheck('/gm/ping', accessToken);

    const adminOk = user.expects.admin ? adminStatus === 200 : adminStatus === 403;
    const gmOk = user.expects.gm ? gmStatus === 200 : gmStatus === 403;

    if (!adminOk) {
      throw new Error(`/admin/ping expected ${user.expects.admin ? 200 : 403}, got ${adminStatus}`);
    }
    if (!gmOk) {
      throw new Error(`/gm/ping expected ${user.expects.gm ? 200 : 403}, got ${gmStatus}`);
    }

    // eslint-disable-next-line no-await-in-loop
    await signOut(accessToken);
    console.log(`✓ ${user.label} login/logout + roles ok (${user.email})`);
  } catch (error) {
    failed = true;
    console.error(`✗ ${user.label} failed: ${error.message}`);
  }
}

if (failed) {
  process.exit(1);
}

console.log('Auth/session verification complete.');
