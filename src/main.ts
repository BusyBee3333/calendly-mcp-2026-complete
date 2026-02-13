#!/usr/bin/env node
import { runStdioServer } from './server.js';

const apiKey = process.env.CALENDLY_API_KEY;
const accessToken = process.env.CALENDLY_ACCESS_TOKEN;

if (!apiKey && !accessToken) {
  console.error('Error: CALENDLY_API_KEY or CALENDLY_ACCESS_TOKEN environment variable must be set');
  process.exit(1);
}

runStdioServer({ apiKey, accessToken }).catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
