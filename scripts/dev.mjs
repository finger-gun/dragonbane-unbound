import fs from 'fs';
import { spawnSync } from 'child_process';

const run = (command, args) => {
  const result = spawnSync(command, args, { stdio: 'inherit' });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
};

const canRunDocker = () => {
  const result = spawnSync('docker', ['info'], { stdio: 'ignore' });
  return result.status === 0;
};

if (!fs.existsSync('.env')) {
  run('pnpm', ['supabase:init']);
}

if (canRunDocker()) {
  run('pnpm', ['supabase:up']);
} else {
  console.log('Docker is not running. Skipping Supabase startup.');
}
run('pnpm', ['turbo', 'run', 'dev', '--parallel']);
