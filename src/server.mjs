#!/usr/bin/env node

const SERVER_VERSION = '0.1.6';
const MCP_ENDPOINT = 'https://mcp.genesisre.io/mcp';
const SERVER_CARD = 'https://mcp.genesisre.io/.well-known/mcp/server-card.json';
const PRODUCT_PAGE = 'https://genesisre.io/proofrelay';

const boundary = [
  'read-only public-safe MCP server',
  'non-confidential evidence metadata only',
  'no secrets, prompts, source code, raw logs, customer files, wallet keys, or payment credentials',
  'no payment processing, custody, legal/title certification, or real-world-truth attestation'
];

const readOnlyAnnotations = {
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: false
};

const statusEnum = ['pass', 'fail', 'needs_review', 'skipped'];

const boundarySchema = {
  type: 'array',
  items: { type: 'string' },
  description: 'Public-safe operating boundary and non-claims.'
};

const statusOutputSchema = {
  type: 'object',
  properties: {
    status: { type: 'string' },
    server_name: { type: 'string' },
    hosted_mcp_endpoint: { type: 'string' },
    server_card: { type: 'string' },
    product_page: { type: 'string' },
    public_tool_count: { type: 'number' },
    local_glama_tool_count: { type: 'number' },
    boundary: boundarySchema
  },
  required: ['status', 'server_name', 'hosted_mcp_endpoint', 'server_card', 'product_page', 'public_tool_count', 'local_glama_tool_count', 'boundary'],
  additionalProperties: false
};

const checkpointOutputSchema = {
  type: 'object',
  properties: {
    status: { type: 'string', enum: statusEnum },
    checkpoint: { type: 'string' },
    reason: { type: 'string' },
    action_class: { type: 'string' },
    boundary: boundarySchema
  },
  required: ['status', 'checkpoint', 'reason', 'boundary'],
  additionalProperties: false
};

const bundleOutputSchema = {
  type: 'object',
  properties: {
    status: { type: 'string', enum: ['pass', 'fail'] },
    verifier: { type: 'string' },
    checks: {
      type: 'object',
      properties: {
        bundle_is_object: { type: 'boolean' },
        confidential_marker_scan: { type: 'boolean' }
      },
      required: ['bundle_is_object', 'confidential_marker_scan'],
      additionalProperties: false
    },
    problems: { type: 'array', items: { type: 'string' } },
    note: { type: 'string' },
    hosted_mcp_endpoint: { type: 'string' },
    boundary: boundarySchema
  },
  required: ['status', 'verifier', 'checks', 'problems', 'note', 'hosted_mcp_endpoint', 'boundary'],
  additionalProperties: false
};

const riskOutputSchema = {
  type: 'object',
  properties: {
    status: { type: 'string', enum: ['pass', 'needs_review'] },
    findings: { type: 'array', items: { type: 'string' } },
    recommended_control: { type: 'string' },
    non_claims: { type: 'array', items: { type: 'string' } },
    boundary: boundarySchema
  },
  required: ['status', 'findings', 'recommended_control', 'non_claims', 'boundary'],
  additionalProperties: false
};

const helperOutputSchema = {
  type: 'object',
  properties: {
    helper: { type: 'string' },
    statuses: { type: 'array', items: { type: 'string', enum: statusEnum } },
    hosted_mcp_endpoint: { type: 'string' },
    example_flow: { type: 'string' },
    boundary: boundarySchema
  },
  required: ['helper', 'statuses', 'hosted_mcp_endpoint', 'example_flow', 'boundary'],
  additionalProperties: false
};

const tools = [
  {
    name: 'proofrelay.get_verifier_status',
    description: 'Read-only status lookup for public ProofRelay discovery metadata. Use first to confirm the hosted MCP endpoint, server-card URL, product URL, public tool count, and trust boundary. Requires no authentication, performs no network call from this local wrapper, mutates nothing, and returns JSON text with status, URLs, counts, and non-confidential boundary notes.',
    annotations: {
      ...readOnlyAnnotations,
      title: 'Get public ProofRelay verifier status'
    },
    inputSchema: {
      type: 'object',
      properties: {},
      additionalProperties: false
    },
    outputSchema: statusOutputSchema
  },
  {
    name: 'proofrelay.recommend_checkpoint',
    description: 'Read-only checkpoint recommendation for a high-level agent action class. Use before relied-upon actions such as paid_tool_call, revenue_action, external_reliance, or financial_transaction; use get_verifier_status for discovery only and verify_bundle after evidence metadata exists. Requires no authentication, mutates nothing, and returns JSON text with status pass, skipped, or needs_review plus checkpoint and reason fields.',
    annotations: {
      ...readOnlyAnnotations,
      title: 'Recommend ProofRelay checkpoint'
    },
    inputSchema: {
      type: 'object',
      properties: {
        action_class: {
          type: 'string',
          description: 'High-level action class. Typical values are paid_tool_call, revenue_action, external_reliance, financial_transaction, local_dev, draft, or read_only_research. High-reliance classes need an authority envelope.'
        },
        has_authority_envelope: {
          type: 'boolean',
          description: 'Set true when the caller already has a bounded authority envelope for the action. Defaults to false when omitted.'
        }
      },
      required: ['action_class'],
      additionalProperties: false
    },
    outputSchema: checkpointOutputSchema
  },
  {
    name: 'proofrelay.verify_bundle',
    description: 'Read-only public-safe bundle shape check for synthetic or non-confidential evidence metadata. Use when you already have a bundle fixture and need a local pass/fail boundary check before sharing or routing to hosted verification; use recommend_checkpoint when deciding whether a checkpoint is needed. Requires no authentication, mutates nothing, does not certify real-world facts, and returns JSON text with status, checks, problems, verifier, and hosted endpoint fields.',
    annotations: {
      ...readOnlyAnnotations,
      title: 'Verify public-safe bundle fixture'
    },
    inputSchema: {
      type: 'object',
      properties: {
        bundle: {
          type: 'object',
          description: 'Synthetic or non-confidential evidence bundle metadata. Do not include secrets, prompts, raw logs, source code, customer files, wallet keys, payment credentials, or tenant traces.'
        }
      },
      required: ['bundle'],
      additionalProperties: false
    },
    outputSchema: bundleOutputSchema
  },
  {
    name: 'proofrelay.scan_mcp_risk',
    description: 'Read-only advisory scan of caller-supplied public MCP descriptor metadata. Use before registering or trusting an MCP server to flag mutating tools, payment or wallet language, credential signals, or missing public metadata; use verify_bundle for evidence bundles instead. Requires no authentication, does not fetch server_url, mutates nothing, is not a security certification, and returns JSON text with status, findings, recommended_control, non_claims, and boundary fields.',
    annotations: {
      ...readOnlyAnnotations,
      title: 'Scan public MCP risk metadata'
    },
    inputSchema: {
      type: 'object',
      properties: {
        server_url: {
          type: 'string',
          description: 'Optional public MCP server URL used only as supplied metadata. This local wrapper does not fetch it.'
        },
        descriptor: {
          type: 'object',
          description: 'Optional public MCP descriptor or listing metadata to inspect for advisory risk signals.'
        }
      },
      additionalProperties: false
    },
    outputSchema: riskOutputSchema
  },
  {
    name: 'proofrelay.describe_cli_sdk_helper',
    description: 'Read-only integration guide for the invisible pass/fail/review helper pattern. Use when an agent or developer needs to understand how to wrap actions with ProofRelay-style checkpoint statuses; use recommend_checkpoint for a specific action decision. Requires no authentication, mutates nothing, and returns JSON text describing statuses, hosted endpoint, and the action-to-audit flow.',
    annotations: {
      ...readOnlyAnnotations,
      title: 'Describe ProofRelay helper integration'
    },
    inputSchema: {
      type: 'object',
      properties: {},
      additionalProperties: false
    },
    outputSchema: helperOutputSchema
  }
];

const resources = [
  {
    uri: 'proofrelay://server-card',
    name: 'ProofRelay MCP server card',
    description: 'Public server-card URL and tool-count metadata.',
    mimeType: 'application/json'
  },
  {
    uri: 'proofrelay://boundary',
    name: 'ProofRelay public trust boundary',
    description: 'Public-safe data boundary and non-claims.',
    mimeType: 'application/json'
  }
];

const resourceTemplates = [];

const prompts = [
  {
    name: 'proofrelay-public-safe-bundle-review',
    description: 'Ask an agent to review a non-confidential evidence bundle without exposing secrets.',
    arguments: [
      {
        name: 'action_class',
        description: 'High-level action class to checkpoint.',
        required: true
      }
    ]
  }
];

function jsonText(value) {
  return {
    structuredContent: value,
    content: [
      {
        type: 'text',
        text: JSON.stringify(value, null, 2)
      }
    ],
    isError: false
  };
}

function recommendCheckpoint(args) {
  const actionClass = String(args?.action_class || '').trim();
  const hasAuthority = Boolean(args?.has_authority_envelope);
  if (!actionClass) {
    return {
      status: 'needs_review',
      checkpoint: 'authority_envelope_check',
      reason: 'missing_action_class',
      boundary
    };
  }
  if (!hasAuthority && ['paid_tool_call', 'revenue_action', 'external_reliance', 'financial_transaction'].includes(actionClass)) {
    return {
      status: 'needs_review',
      checkpoint: 'authority_envelope_check',
      reason: 'authority_envelope_missing',
      action_class: actionClass,
      boundary
    };
  }
  if (['local_dev', 'draft', 'read_only_research'].includes(actionClass)) {
    return {
      status: 'skipped',
      checkpoint: 'none_required',
      reason: 'low_reliance_local_or_draft_action',
      action_class: actionClass,
      boundary
    };
  }
  return {
    status: 'pass',
    checkpoint: 'evidence_bundle_verification',
    reason: 'checkpoint_recommended_for_relied_upon_output',
    action_class: actionClass,
    boundary
  };
}

function verifyBundle(args) {
  const bundle = args?.bundle;
  const problems = [];
  if (!bundle || typeof bundle !== 'object' || Array.isArray(bundle)) {
    problems.push('bundle must be an object');
  }
  if (bundle && typeof bundle === 'object') {
    const text = JSON.stringify(bundle).toLowerCase();
    for (const marker of ['secret', 'private_key', 'api_key', 'password', 'wallet_key', 'customer_file']) {
      if (text.includes(marker)) problems.push(`bundle contains forbidden marker: ${marker}`);
    }
  }
  return {
    status: problems.length ? 'fail' : 'pass',
    verifier: 'genesis-proofrelay-public-local-check',
    checks: {
      bundle_is_object: problems.length === 0,
      confidential_marker_scan: problems.length === 0
    },
    problems,
    note: 'This public local server performs shape and boundary checks only. Full hosted verification is available at the public MCP endpoint.',
    hosted_mcp_endpoint: MCP_ENDPOINT,
    boundary
  };
}

function scanMcpRisk(args) {
  const descriptor = args?.descriptor || {};
  const text = JSON.stringify(descriptor).toLowerCase();
  const findings = [];
  if (text.includes('write') || text.includes('delete') || text.includes('mutate')) findings.push('mutating_tool_signal');
  if (text.includes('payment') || text.includes('wallet') || text.includes('credential')) findings.push('sensitive_flow_signal');
  if (!args?.server_url && Object.keys(descriptor).length === 0) findings.push('missing_public_descriptor_metadata');
  return {
    status: findings.length ? 'needs_review' : 'pass',
    findings,
    recommended_control: findings.length ? 'manual operator review before registration' : 'public metadata has no obvious high-risk signal',
    non_claims: ['advisory only', 'not a source-code review', 'not a security certification'],
    boundary
  };
}

function callTool(name, args) {
  if (name === 'proofrelay.get_verifier_status') {
    return jsonText({
      status: 'online_public_discovery_wrapper',
      server_name: 'GENESIS ProofRelay MCP',
      hosted_mcp_endpoint: MCP_ENDPOINT,
      server_card: SERVER_CARD,
      product_page: PRODUCT_PAGE,
      public_tool_count: 22,
      local_glama_tool_count: tools.length,
      boundary
    });
  }
  if (name === 'proofrelay.recommend_checkpoint') return jsonText(recommendCheckpoint(args));
  if (name === 'proofrelay.verify_bundle') return jsonText(verifyBundle(args));
  if (name === 'proofrelay.scan_mcp_risk') return jsonText(scanMcpRisk(args));
  if (name === 'proofrelay.describe_cli_sdk_helper') {
    return jsonText({
      helper: 'invisible pass/fail/review checkpoint wrapper',
      statuses: ['pass', 'fail', 'needs_review', 'skipped'],
      hosted_mcp_endpoint: MCP_ENDPOINT,
      example_flow: 'agent/tool action -> metadata receipt -> checkpoint -> pass/fail/review -> audit artifact when needed',
      boundary
    });
  }
  return {
    content: [{ type: 'text', text: `Unknown tool: ${name}` }],
    isError: true
  };
}

function readResource(uri) {
  if (uri === 'proofrelay://server-card') {
    return {
      contents: [
        {
          uri,
          mimeType: 'application/json',
          text: JSON.stringify({ hosted_mcp_endpoint: MCP_ENDPOINT, server_card: SERVER_CARD, public_tool_count: 22 }, null, 2)
        }
      ]
    };
  }
  if (uri === 'proofrelay://boundary') {
    return {
      contents: [
        {
          uri,
          mimeType: 'application/json',
          text: JSON.stringify({ boundary }, null, 2)
        }
      ]
    };
  }
  throw new Error(`Unknown resource: ${uri}`);
}

function getPrompt(name, args) {
  if (name !== 'proofrelay-public-safe-bundle-review') throw new Error(`Unknown prompt: ${name}`);
  return {
    description: 'Public-safe ProofRelay bundle review prompt.',
    messages: [
      {
        role: 'user',
        content: {
          type: 'text',
          text: `Review a non-confidential ProofRelay bundle for action class ${args?.action_class || 'unknown'}. Do not request secrets, private prompts, raw logs, customer files, wallet keys, payment credentials, or source code.`
        }
      }
    ]
  };
}

function handleRequest(message) {
  const { id, method, params } = message;
  if (method === 'initialize') {
    return {
      jsonrpc: '2.0',
      id,
      result: {
        protocolVersion: params?.protocolVersion || '2024-11-05',
        capabilities: { tools: {}, resources: {}, prompts: {} },
        serverInfo: { name: 'genesis-proofrelay', version: SERVER_VERSION }
      }
    };
  }
  if (method === 'ping') return { jsonrpc: '2.0', id, result: {} };
  if (method === 'tools/list') return { jsonrpc: '2.0', id, result: { tools } };
  if (method === 'tools/call') return { jsonrpc: '2.0', id, result: callTool(params?.name, params?.arguments || {}) };
  if (method === 'resources/list') return { jsonrpc: '2.0', id, result: { resources } };
  if (method === 'resources/templates/list') return { jsonrpc: '2.0', id, result: { resourceTemplates } };
  if (method === 'resources/read') return { jsonrpc: '2.0', id, result: readResource(params?.uri) };
  if (method === 'prompts/list') return { jsonrpc: '2.0', id, result: { prompts } };
  if (method === 'prompts/get') return { jsonrpc: '2.0', id, result: getPrompt(params?.name, params?.arguments || {}) };
  return { jsonrpc: '2.0', id, error: { code: -32601, message: `Method not found: ${method}` } };
}

function sendFramed(message) {
  const body = JSON.stringify(message);
  process.stdout.write(`Content-Length: ${Buffer.byteLength(body, 'utf8')}\r\n\r\n${body}`);
}

function sendLine(message) {
  process.stdout.write(`${JSON.stringify(message)}\n`);
}

let buffer = Buffer.alloc(0);
const keepAlive = setInterval(() => {}, 1 << 30);

function processBuffer() {
  while (true) {
    let raw;
    let send = sendFramed;

    if (buffer[0] === 0x7b) {
      const lineEnd = buffer.indexOf('\n');
      if (lineEnd === -1) return;
      raw = buffer.slice(0, lineEnd).toString('utf8').replace(/\r$/, '');
      buffer = buffer.slice(lineEnd + 1);
      send = sendLine;
    } else {
      const crlfHeaderEnd = buffer.indexOf('\r\n\r\n');
      const lfHeaderEnd = buffer.indexOf('\n\n');
      const useLfHeader =
        lfHeaderEnd !== -1 && (crlfHeaderEnd === -1 || lfHeaderEnd < crlfHeaderEnd);
      const headerEnd = useLfHeader ? lfHeaderEnd : crlfHeaderEnd;
      if (headerEnd === -1) return;
      const separatorLength = useLfHeader ? 2 : 4;
      const header = buffer.slice(0, headerEnd).toString('utf8');
      const match = header.match(/Content-Length:\s*(\d+)/i);
      if (!match) throw new Error('Missing Content-Length header');
      const length = Number(match[1]);
      const messageStart = headerEnd + separatorLength;
      const messageEnd = messageStart + length;
      if (buffer.length < messageEnd) return;
      raw = buffer.slice(messageStart, messageEnd).toString('utf8');
      buffer = buffer.slice(messageEnd);
    }

    const message = JSON.parse(raw);
    if (message.id === undefined || message.id === null) continue;
    try {
      send(handleRequest(message));
    } catch (error) {
      send({ jsonrpc: '2.0', id: message.id, error: { code: -32000, message: error.message } });
    }
  }
}

process.stdin.on('data', (chunk) => {
  buffer = Buffer.concat([buffer, chunk]);
  processBuffer();
});

process.stdin.on('end', () => {});
process.on('uncaughtException', (error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
