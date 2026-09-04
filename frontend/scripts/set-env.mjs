#!/usr/bin/env node
/**
 * Generates `environment.ts` and `environment.prod.ts` from `.env`.
 *
 * An Angular SPA runs in the browser, so it cannot read `process.env` at
 * runtime. Instead we resolve the Keycloak configuration from the local
 * `.env` files at build time and bake the values into the environment
 * modules via placeholder substitution.
 */

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = resolve(import.meta.dirname, '..');
const ENV_FILES = ['.env.local', '.env'];
const TEMPLATE_PATH = resolve(ROOT, 'src/environments/environment.template.ts');

function loadEnv() {
  const vars = {};
  for (const file of ENV_FILES) {
    const filePath = resolve(file);
    try {
      // Node >= 20.12 native .env loader (overrides existing keys).
      process.loadEnvFile(filePath, { override: true });
    } catch (error) {
      // Skip missing files silently; surface other errors.
      if (error?.code !== 'ENOENT') {
        throw error;
      }
    }
  }
  for (const [key, value] of Object.entries(process.env)) {
    if (key.startsWith('KEYCLOAK_')) {
      vars[key] = value;
    }
  }
  return vars;
}

function generate(templatePath, outputPath, production) {
  const template = readFileSync(templatePath, 'utf8');
  const vars = loadEnv();
  const content = template
    .replace(/production: false/, `production: ${production}`)
    .replace(/{{(\w+)}}/g, (match, key) => vars[key] ?? '');

  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, content, 'utf8');
  console.log(`[set-env] generated ${outputPath}`);
}

generate(TEMPLATE_PATH, resolve(ROOT, 'src/environments/environment.ts'), false);
generate(
  TEMPLATE_PATH,
  resolve(ROOT, 'src/environments/environment.prod.ts'),
  true,
);