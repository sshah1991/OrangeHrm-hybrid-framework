import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Initialize environment variables from .env file
dotenv.config();

export default defineConfig({
  testDir: './tests',
  use: {
    // Set the baseURL here so page.goto("/") works
    baseURL: process.env.BASE_URL, 
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});