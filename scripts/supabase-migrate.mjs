import fs from 'fs';
import path from 'path';
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

if (!fs.existsSync(envPath)) {
  console.error('Missing .env. Run: pnpm supabase:init');
  process.exit(1);
}

const env = parseEnv(fs.readFileSync(envPath, 'utf8'));
const dbUser = env.get('SUPABASE_DB_USER') || 'postgres';
const dbPassword = env.get('SUPABASE_DB_PASSWORD') || 'postgres';
const dbName = env.get('SUPABASE_DB_NAME') || 'postgres';

process.env.PGPASSWORD = dbPassword;

const sqlDir = path.join(process.cwd(), 'supabase', 'sql');
const files = fs
  .readdirSync(sqlDir)
  .filter((file) => file.endsWith('.sql'))
  .sort();

if (files.length === 0) {
  console.log('No SQL migrations found in supabase/sql.');
  process.exit(0);
}

for (const file of files) {
  const fullPath = path.join(sqlDir, file);
  const sql = fs.readFileSync(fullPath, 'utf8');
  console.log(`Applying migration: ${file}`);
  const cmd = `docker compose exec -T db psql -v ON_ERROR_STOP=1 -U ${dbUser} -d ${dbName} -f /dev/stdin`;
  execSync(cmd, { stdio: 'inherit', input: sql });
}

console.log('Supabase SQL migrations applied.');
