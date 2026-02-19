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
const kongPort = env.get('SUPABASE_KONG_PORT') || '54321';
const studioPort = env.get('SUPABASE_STUDIO_PORT') || '54323';
const anonKey = env.get('SUPABASE_ANON_KEY') || '';

const checks = [
  {
    name: 'Auth health',
    url: 'http://localhost:9999/health',
    ok: (status) => status === 200,
  },
  {
    name: 'REST (via Kong)',
    url: `http://localhost:${kongPort}/rest/v1/`,
    headers: anonKey ? { apikey: anonKey } : null,
    ok: (status) => status >= 200 && status < 500,
  },
  {
    name: 'Storage (via Kong)',
    url: `http://localhost:${kongPort}/storage/v1/`,
    headers: anonKey ? { apikey: anonKey } : null,
    ok: (status) => status >= 200 && status < 500,
  },
  {
    name: 'Studio',
    url: `http://localhost:${studioPort}`,
    ok: (status) => status >= 200 && status < 400,
  },
];

let failed = false;

const check = async ({ name, url, headers, ok }) => {
  try {
    const response = await fetch(url, { headers: headers ?? undefined });
    if (ok(response.status)) {
      console.log(`✓ ${name}: HTTP ${response.status} (${url})`);
    } else {
      console.log(`✗ ${name}: HTTP ${response.status} (${url})`);
      failed = true;
    }
  } catch (error) {
    console.log(`✗ ${name}: unreachable (${url})`);
    failed = true;
  }
};

if (!anonKey) {
  console.log('! REST/Storage: missing SUPABASE_ANON_KEY');
  failed = true;
}

console.log('Verifying local Supabase...');
for (const entry of checks) {
  if ((entry.name.includes('REST') || entry.name.includes('Storage')) && !anonKey) {
    continue;
  }
  // eslint-disable-next-line no-await-in-loop
  await check(entry);
}

if (failed) {
  console.log('Verification failed. Check docker compose logs.');
  process.exit(1);
}

console.log('Supabase verification complete.');
