# GENESIS ProofRelay MCP

Public discovery package for the GENESIS ProofRelay MCP verifier.

[![Smithery](https://smithery.ai/badge/genesis/proof-relay)](https://smithery.ai/servers/genesis/proof-relay)
[![proofrelay MCP server](https://glama.ai/mcp/servers/GENESISRE/proofrelay/badges/card.svg)](https://glama.ai/mcp/servers/GENESISRE/proofrelay)
[![proofrelay MCP score](https://glama.ai/mcp/servers/GENESISRE/proofrelay/badges/score.svg)](https://glama.ai/mcp/servers/GENESISRE/proofrelay)

ProofRelay is a read-only MCP verifier for non-confidential evidence bundles.
It helps agents and operators check bundle integrity, receipt ordering,
hash-chain continuity, checkpoint recommendations, MCP risk metadata, and
real-estate closing proof-pack readiness.

## Public Links

- Glama listing: <https://glama.ai/mcp/servers/GENESISRE/proofrelay>
- Smithery listing: <https://smithery.ai/servers/genesis/proof-relay>
- Product page: <https://genesisre.io/proofrelay>
- MCP endpoint: <https://mcp.genesisre.io/mcp>
- MCP health: <https://mcp.genesisre.io/health>
- MCP server card: <https://mcp.genesisre.io/.well-known/mcp/server-card.json>
- Agent service descriptor: <https://genesisre.io/.well-known/proofrelay-agent-service.json>
- Terms: <https://genesisre.io/legal/proofrelay-terms>

## Install From Smithery

```bash
npx -y smithery mcp add genesis/proof-relay
npx -y smithery mcp get proof-relay
npx -y smithery tool list proof-relay
npx -y smithery tool call proof-relay proofrelay.get_verifier_status '{}'
```

## Generic MCP Client

```json
{
  "mcpServers": {
    "genesis-proofrelay": {
      "type": "http",
      "url": "https://mcp.genesisre.io/mcp"
    }
  }
}
```

## Trust Boundary

ProofRelay verifies submitted non-confidential evidence bundle shape and
integrity signals. It does not process payments, custody funds, escrow assets,
certify legal/title/compliance status, certify real-world facts, provide legal
advice, review private source code, or require source-code disclosure.

Do not submit secrets, private prompts, raw logs, source code, customer files,
wallet keys, payment credentials, or tenant traces to the public MCP endpoint.

## Public Repository Boundary

This repository is intentionally limited to public ProofRelay MCP discovery,
setup, and trust-boundary material. The hosted MCP service is operated by
GENESIS at `mcp.genesisre.io`.

This repository does not include:

- internal GENESIS monorepo code
- production deployment automation
- private credentials or environment files
- paid settlement adapters
- Skyfire, Coinbase, Stripe, AWS, or internal operator secrets
- customer data, raw logs, prompts, traces, or evidence bundles

See [PUBLICATION_BOUNDARY.md](PUBLICATION_BOUNDARY.md) for the publication
allowlist and exclusion policy.

## License

MIT. See [LICENSE](LICENSE).
