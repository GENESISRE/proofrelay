#!/usr/bin/env node

import { spawn } from 'node:child_process';

const child = spawn(process.execPath, ['src/server.mjs'], {
  stdio: ['pipe', 'pipe', 'inherit']
});

let buffer = Buffer.alloc(0);

function send(id, method, params = {}) {
  const body = JSON.stringify({ jsonrpc: '2.0', id, method, params });
  child.stdin.write(`Content-Length: ${Buffer.byteLength(body)}\r\n\r\n${body}`);
}

function readMessages() {
  const messages = [];
  while (true) {
    const headerEnd = buffer.indexOf('\r\n\r\n');
    if (headerEnd === -1) break;
    const header = buffer.slice(0, headerEnd).toString('utf8');
    const match = header.match(/Content-Length:\s*(\d+)/i);
    if (!match) throw new Error('missing content length');
    const length = Number(match[1]);
    const start = headerEnd + 4;
    const end = start + length;
    if (buffer.length < end) break;
    messages.push(JSON.parse(buffer.slice(start, end).toString('utf8')));
    buffer = buffer.slice(end);
  }
  return messages;
}

const responses = new Map();
child.stdout.on('data', (chunk) => {
  buffer = Buffer.concat([buffer, chunk]);
  for (const message of readMessages()) responses.set(message.id, message);
});

send(1, 'initialize', { protocolVersion: '2024-11-05', capabilities: {}, clientInfo: { name: 'smoke', version: '1.0.0' } });
send(2, 'tools/list');
send(3, 'tools/call', { name: 'proofrelay.get_verifier_status', arguments: {} });

setTimeout(() => {
  const init = responses.get(1);
  const tools = responses.get(2);
  const call = responses.get(3);
  child.kill();
  if (!init?.result?.serverInfo) throw new Error('initialize failed');
  if (!Array.isArray(tools?.result?.tools) || tools.result.tools.length < 5) throw new Error('tool list failed');
  if (!call?.result?.content?.[0]?.text?.includes('mcp.genesisre.io')) throw new Error('tool call failed');
  console.log('PROOFRELAY_GLAMA_LOCAL_MCP_SMOKE_OK');
}, 250);
