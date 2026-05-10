import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Initialize environment variables from .env file
dotenv.config();

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: process.env.BASE_URL,
    // Runs headless in CI, but headed locally for debugging
    headless: !!process.env.CI, 
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});