#!/usr/bin/env node

import { readFileSync } from 'node:fs';

const source = readFileSync('src/server.mjs', 'utf8');

for (const required of [
  "const SERVER_VERSION = '0.1.5'",
  'readOnlyHint: true',
  'destructiveHint: false',
  'Requires no authentication',
  'function sendFramed(message)',
  'function sendLine(message)',
  "method === 'initialize'",
  "method === 'tools/list'",
  "method === 'tools/call'",
  "method === 'resources/templates/list'",
  'proofrelay.get_verifier_status',
  'mcp.genesisre.io'
]) {
  if (!source.includes(required)) {
    throw new Error(`missing expected server marker: ${required}`);
  }
}

console.log('PROOFRELAY_GLAMA_LOCAL_MCP_SMOKE_OK');
