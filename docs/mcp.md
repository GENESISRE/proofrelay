# ProofRelay MCP Discovery

> **Archived non-canonical documentation snapshot.** This file is not an API
> contract. Confirm all current tools and schemas from the live server card.

## Endpoint

`https://mcp.genesisre.io/mcp`

## Health Check

```bash
curl -fsS https://mcp.genesisre.io/health
```

Expected shape:

```json
{
  "ok": true,
  "service": "GENESIS ProofRelay MCP verifier",
  "mcp_endpoint": "/mcp"
}
```

## Smithery

```bash
npx -y smithery mcp add genesis/proof-relay
npx -y smithery tool list proof-relay
npx -y smithery tool call proof-relay proofrelay.get_verifier_status '{}'
```

## Public Tool Surface

On 2026-08-27 the public server card exposed 26 read-only tools, 18 resources,
and 13 prompts. These observed counts may change.

Canonical server card:

`https://mcp.genesisre.io/.well-known/mcp/server-card.json`

## Safety Boundary

Use synthetic or non-confidential evidence metadata only. Do not submit secrets,
private prompts, source code, customer data, raw logs, wallet keys, payment
credentials, tenant traces, or confidential evidence bundles.
