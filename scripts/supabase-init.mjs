import crypto from 'crypto';
import fs from 'fs';
import net from 'net';
import path from 'path';
import { execSync } from 'child_process';

const root = process.cwd();
const envPath = path.join(root, '.env');
const examplePath = path.join(root, '.env.example');

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

const defaults = fs.existsSync(examplePath)
  ? parseEnv(fs.readFileSync(examplePath, 'utf8'))
  : new Map();

if (!fs.existsSync(envPath)) {
  if (!fs.existsSync(examplePath)) {
    console.error('Missing .env.example; cannot initialize .env');
    process.exit(1);
  }
  fs.copyFileSync(examplePath, envPath);
}

const raw = fs.readFileSync(envPath, 'utf8');
const lines = raw.split(/\r?\n/);
const current = parseEnv(raw);
const updatedKeys = [];

const ensureValue = (key, fallback) => {
  const hasValue = current.has(key) && current.get(key) !== '';
  if (!hasValue) {
    const next = defaults.get(key) ?? fallback;
    if (typeof next === 'string') {
      current.set(key, next);
      updatedKeys.push(key);
    }
  }
};

const canBind = (port, host, options = {}) =>
  new Promise((resolve) => {
    const server = net.createServer();
    server.unref();
    server.on('error', () => resolve(false));
    server.listen({ port, host, ...options }, () => {
      server.close(() => resolve(true));
    });
  });

const isPortFree = async (port) => {
  try {
    const output = execSync(`lsof -iTCP:${port} -sTCP:LISTEN -n -P`, {
      stdio: ['ignore', 'pipe', 'ignore'],
    })
      .toString()
      .trim();
    if (output) {
      return false;
    }
  } catch (error) {
    // lsof returns non-zero when no matches; ignore.
  }
  const ipv4Free = await canBind(port, '0.0.0.0');
  if (!ipv4Free) return false;
  const ipv6Free = await canBind(port, '::', { ipv6Only: true });
  return ipv6Free;
};

const findFreePort = async (startPort, reserved, maxTries = 200) => {
  let port = startPort;
  for (let i = 0; i < maxTries; i += 1) {
    if (!reserved.has(port)) {
      // eslint-disable-next-line no-await-in-loop
      if (await isPortFree(port)) {
        return port;
      }
    }
    port += 1;
  }
  return startPort;
};

const reservedPorts = new Set();

const markReserved = (value) => {
  const numeric = Number.parseInt(value, 10);
  if (!Number.isNaN(numeric)) {
    reservedPorts.add(numeric);
  }
};

const ensurePort = async (key, fallback) => {
  const existing = current.get(key);
  if (existing && existing !== '') {
    return;
  }
  const rawValue = defaults.get(key) || fallback;
  const numeric = Number.parseInt(rawValue, 10);
  if (Number.isNaN(numeric)) {
    return;
  }
  const isFree = await isPortFree(numeric);
  const nextPort = isFree ? numeric : await findFreePort(numeric + 1, reservedPorts);
  const nextValue = String(nextPort);
  current.set(key, nextValue);
  reservedPorts.add(nextPort);
  updatedKeys.push(key);
};

await ensurePort('SUPABASE_DB_PORT', '54322');
await ensurePort('SUPABASE_STORAGE_PORT', '5000');
await ensurePort('SUPABASE_KONG_PORT', '54321');
await ensurePort('SUPABASE_STUDIO_PORT', '54323');
ensureValue('SUPABASE_DB_USER', 'postgres');
ensureValue('SUPABASE_DB_PASSWORD', 'postgres');
ensureValue('SUPABASE_DB_NAME', 'postgres');
ensureValue('SUPABASE_SITE_URL', 'http://localhost:3000');

if (!current.has('SUPABASE_JWT_SECRET') || current.get('SUPABASE_JWT_SECRET') === '') {
  const secret = crypto.randomBytes(32).toString('base64');
  current.set('SUPABASE_JWT_SECRET', secret);
  updatedKeys.push('SUPABASE_JWT_SECRET');
}

const makeJwt = (role, secret) => {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const exp = now + 60 * 60 * 24 * 365;
  const payload = { role, iss: 'supabase', iat: now, exp };
  const b64u = (value) => Buffer.from(JSON.stringify(value)).toString('base64url');
  const token = `${b64u(header)}.${b64u(payload)}`;
  const sig = crypto.createHmac('sha256', secret).update(token).digest('base64url');
  return `${token}.${sig}`;
};

const secret = current.get('SUPABASE_JWT_SECRET');
if (secret) {
  if (!current.has('SUPABASE_ANON_KEY') || current.get('SUPABASE_ANON_KEY') === '') {
    current.set('SUPABASE_ANON_KEY', makeJwt('anon', secret));
    updatedKeys.push('SUPABASE_ANON_KEY');
  }
  if (!current.has('SUPABASE_SERVICE_ROLE_KEY') || current.get('SUPABASE_SERVICE_ROLE_KEY') === '') {
    current.set('SUPABASE_SERVICE_ROLE_KEY', makeJwt('service_role', secret));
    updatedKeys.push('SUPABASE_SERVICE_ROLE_KEY');
  }
}

const kongPort = current.get('SUPABASE_KONG_PORT') || '54321';
const existingUrl = current.get('SUPABASE_URL') || '';
const localhostUrl = /^http:\/\/localhost:\d+$/;
if (existingUrl === '' || localhostUrl.test(existingUrl)) {
  const nextUrl = `http://localhost:${kongPort}`;
  if (existingUrl !== nextUrl) {
    current.set('SUPABASE_URL', nextUrl);
    updatedKeys.push('SUPABASE_URL');
  }
}

const updated = lines.map((line) => {
  const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (!match) return line;
  const key = match[1];
  if (current.has(key)) {
    return `${key}=${current.get(key)}`;
  }
  return line;
});

const existingKeys = new Set(
  lines
    .map((line) => line.match(/^([A-Z0-9_]+)=/))
    .filter(Boolean)
    .map((match) => match[1]),
);

current.forEach((value, key) => {
  if (!existingKeys.has(key)) {
    updated.push(`${key}=${value}`);
  }
});

fs.writeFileSync(envPath, updated.join('\n'));

if (updatedKeys.length === 0) {
  console.log('Supabase env: no changes needed.');
} else {
  console.log(`Supabase env updated: ${updatedKeys.join(', ')}`);
}
