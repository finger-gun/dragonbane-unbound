import fs from 'fs';
import { execSync } from 'child_process';


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

if (fs.existsSync(envPath)) {
  const env = parseEnv(fs.readFileSync(envPath, 'utf8'));
  env.forEach((value, key) => {
    if (!process.env[key]) {
      process.env[key] = value;
    }
  });
}

const rawSupabaseUrl = process.env.SUPABASE_URL;
const supabaseUrl = rawSupabaseUrl?.replace('http://localhost', 'http://127.0.0.1');
const authBaseUrl = (process.env.SUPABASE_AUTH_URL || 'http://127.0.0.1:9999').replace(
  'http://localhost',
  'http://127.0.0.1',
);
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}

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

const getValue = (key, fallback) => process.env[key] || fallback;

const users = [
  {
    label: 'admin',
    email: getValue('SEED_ADMIN_EMAIL', 'admin@local.test'),
    password: getValue('SEED_ADMIN_PASSWORD', 'localpass123!'),
    roles: ['admin'],
  },
  {
    label: 'player',
    email: getValue('SEED_PLAYER_EMAIL', 'player@local.test'),
    password: getValue('SEED_PLAYER_PASSWORD', 'localpass123!'),
    roles: ['player'],
  },
  {
    label: 'game-master',
    email: getValue('SEED_GM_EMAIL', 'gm@local.test'),
    password: getValue('SEED_GM_PASSWORD', 'localpass123!'),
    roles: ['game-master'],
  },
  {
    label: 'super',
    email: getValue('SEED_SUPER_EMAIL', 'super@local.test'),
    password: getValue('SEED_SUPER_PASSWORD', 'localpass123!'),
    roles: ['admin', 'player', 'game-master'],
  },
];

const upsertRoles = async (userId, roles) => {
  const maxAttempts = 6;
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    // eslint-disable-next-line no-await-in-loop
    const response = await fetch(
      `${supabaseUrl}/rest/v1/user_roles?on_conflict=user_id`,
      {
        method: 'POST',
        headers: {
          apikey: supabaseServiceKey,
          Authorization: `Bearer ${supabaseServiceKey}`,
          'Content-Type': 'application/json',
          Prefer: 'resolution=merge-duplicates',
        },
        body: JSON.stringify({ user_id: userId, roles }),
      },
    );

    if (response.ok) {
      return;
    }

    const detail = await response.text();
    if (response.status === 503 && detail.includes('PGRST002') && attempt < maxAttempts) {
      // eslint-disable-next-line no-await-in-loop
      await new Promise((resolve) => setTimeout(resolve, 500 * attempt));
      continue;
    }

    throw new Error(`Failed to set roles: ${response.status} ${detail}`);
  }
};

const authRequest = async (path, options = {}) => {
  const response = await fetch(`${authBaseUrl}${path}`, {
    ...options,
    headers: {
      apikey: supabaseServiceKey,
      Authorization: `Bearer ${supabaseServiceKey}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Auth admin request failed (${response.status}): ${detail}`);
  }

  return response.json();
};

const ensureRolesTable = () => {
  const dbPort = getValue('SUPABASE_DB_PORT', '5432');
  const dbUser = getValue('SUPABASE_DB_USER', 'postgres');
  const dbPassword = getValue('SUPABASE_DB_PASSWORD', 'postgres');
  const dbName = getValue('SUPABASE_DB_NAME', 'postgres');

  const checkCmd = `docker compose exec -T db psql -U ${dbUser} -d ${dbName} -tAc "select to_regclass('public.user_roles');"`;
  const result = execSync(checkCmd, { encoding: 'utf8' }).trim();
  if (result === 'public.user_roles') {
    return false;
  }

  const sql = fs.readFileSync('supabase/sql/001_user_roles.sql', 'utf8');
  const applyCmd = `docker compose exec -T db psql -U ${dbUser} -d ${dbName} -f /dev/stdin`;
  execSync(applyCmd, { stdio: 'inherit', input: sql });
  return true;
};

const findUserByEmail = async (email) => {
  const data = await authRequest('/admin/users?per_page=1000', { method: 'GET' });
  return data.users.find((user) => user.email === email) ?? null;
};

const ensureUser = async ({ label, email, password, roles }) => {
  const user = await findUserByEmail(email);

  if (user) {
    await upsertRoles(user.id, roles);
    return { label, email, id: user.id, created: false };
  }

  const data = await authRequest('/admin/users', {
    method: 'POST',
    body: JSON.stringify({ email, password, email_confirm: true }),
  });

  await upsertRoles(data.id, roles);
  return { label, email, id: data.id, created: true };
};

const run = async () => {
  console.log('Seeding local users (dev only)...');
  await waitForAuth();
  const createdRoles = ensureRolesTable();
  if (createdRoles) {
    execSync('docker compose restart rest', { stdio: 'inherit' });
    await new Promise((resolve) => setTimeout(resolve, 1500));
  }
  for (const entry of users) {
    // eslint-disable-next-line no-await-in-loop
    const result = await ensureUser(entry);
    console.log(
      `${result.created ? 'Created' : 'Updated'} ${result.label} user: ${result.email} (${result.id})`,
    );
  }
  console.log('Done.');
};

run().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
