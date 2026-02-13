import { execSync } from 'child_process';
import { readdirSync, statSync } from 'fs';
import { join } from 'path';

const appsDir = './src/apps';
const apps = readdirSync(appsDir).filter((file) =>
  statSync(join(appsDir, file)).isDirectory()
);

console.log(`Building ${apps.length} apps...`);

for (const app of apps) {
  console.log(`Building ${app}...`);
  execSync(`npx vite build --config src/apps/${app}/vite.config.ts`, {
    stdio: 'inherit',
  });
}

console.log('All apps built successfully!');
