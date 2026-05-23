# ProofRelay MCP Setup

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

The public server card currently exposes 22 read-only public-safe tools,
11 resources, and 11 prompts.

Canonical server card:

`https://mcp.genesisre.io/.well-known/mcp/server-card.json`

## Safety Boundary

Use synthetic or non-confidential evidence metadata only. Do not submit secrets,
private prompts, source code, customer data, raw logs, wallet keys, payment
credentials, tenant traces, or confidential evidence bundles.
