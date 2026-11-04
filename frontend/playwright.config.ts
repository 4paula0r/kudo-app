import { defineConfig } from '@playwright/test'
import { dirname, resolve } from 'node:path'
import { randomBytes } from 'node:crypto'
import { fileURLToPath } from 'node:url'

const frontendDir = dirname(fileURLToPath(import.meta.url))
const repoDir = resolve(frontendDir, '..')
const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error('Define DATABASE_URL hacia una base PostgreSQL de pruebas llamada kudo_test.')
}
const databaseName = new URL(databaseUrl).pathname.replace(/^\/+/, '')
if (databaseName !== 'kudo_test') {
  throw new Error('Playwright solo puede ejecutarse contra la base aislada kudo_test.')
}

const jwtSecret = process.env.JWT_SECRET || randomBytes(32).toString('hex')

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  workers: 1,
  timeout: 120_000,
  reporter: [
    ['list'],
    ['html', { outputFolder: resolve(repoDir, 'docs/evidencias/pruebas/playwright-report'), open: 'never' }],
  ],
  outputDir: resolve(repoDir, 'docs/evidencias/pruebas/test-results'),
  use: {
    baseURL: 'http://127.0.0.1:4173',
    viewport: { width: 1440, height: 1000 },
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  webServer: [
    {
      command: 'npm run dev',
      cwd: resolve(repoDir, 'backend'),
      url: 'http://127.0.0.1:4401/api/health',
      reuseExistingServer: false,
      timeout: 120_000,
      env: {
        ...process.env,
        PORT: '4401',
        DATABASE_URL: databaseUrl,
        JWT_SECRET: jwtSecret,
        NODE_ENV: 'development',
      },
    },
    {
      command: 'npm run dev -- --config vite.e2e.config.ts --host 127.0.0.1 --port 4173 --strictPort',
      cwd: frontendDir,
      url: 'http://127.0.0.1:4173',
      reuseExistingServer: false,
      timeout: 120_000,
    },
  ],
})