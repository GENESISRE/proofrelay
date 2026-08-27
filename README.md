# GENESIS ProofRelay MCP

> [!WARNING]
> **ARCHIVED NON-CANONICAL SNAPSHOT.** This repository is retained for public
> history and marketplace-link continuity. It is not the canonical ProofRelay
> implementation, is not a source mirror, and is not suitable for production
> reliance. The executable local wrapper formerly stored here intentionally
> implemented only shallow discovery checks and has been removed to prevent it
> from being confused with the hosted verifier.

Documentation-only discovery snapshot for the GENESIS ProofRelay MCP verifier.
The canonical public machine-readable contract is the live
[server card](https://mcp.genesisre.io/.well-known/mcp/server-card.json).

[![Smithery](https://smithery.ai/badge/genesis/proof-relay)](https://smithery.ai/servers/genesis/proof-relay)
ProofRelay's hosted public surface is a read-only MCP verifier for synthetic or
non-confidential evidence bundle metadata. This repository does not implement
or reproduce that verifier.

ProofRelay is not an oracle, escrow service, DeFi risk engine, legal opinion,
or endorsement system. It does not certify real-world truth, prove title,
approve payments, custody funds, or make a third-party tool safe.

## Why This Exists

Agents increasingly take actions that cross from "answer a question" into
"rely on something external": paid tool calls, revenue actions, financial
transactions, closing workflows, marketplace listings, and MCP integrations.
Those actions need simple controls that work before private data or production
systems are exposed.

ProofRelay gives agents a small decision layer:

- decide whether a checkpoint is needed
- check whether public-safe evidence metadata is shaped consistently
- surface mismatch or missing-authority signals
- keep secret-bearing material out of public verification paths
- record pass/fail/review outcomes without claiming real-world certification

## Snapshot status

- Archived from public repository commit
  `feeca01f31fead61a77cb1be9691dd65eec596a0` on 2026-08-27.
- Hosted surface observed on 2026-08-27: 26 tools, 18 resources, 13 prompts.
- Those counts are observations, not a frozen API guarantee. Read the live
  server card before every integration or reliance decision.
- Security review of the prior 17-commit history found no secret with Gitleaks;
  this is not a guarantee that prior clones or third-party mirrors are current.
- Reopening requires the controls in `export-policy.json`, protected review,
  and an explicitly assigned maintenance owner.

## Decision Vocabulary

The hosted service uses these high-level statuses:

| Status | Meaning | Typical next step |
| --- | --- | --- |
| `pass` | The public-safe metadata satisfies the local check. | Continue, while preserving the evidence reference. |
| `needs_review` | The action or bundle has missing, ambiguous, or higher-reliance signals. | Pause for operator, policy, or stronger evidence review. |
| `skipped` | The action class is low-reliance or no checkpoint applies. | Continue without treating the result as verified. |
| `fail` | The bundle shape or required metadata is inconsistent. | Do not rely on the bundle until corrected. |

## Public Tool Surface

Tool names, schemas, counts, and descriptions change independently of this
archived snapshot. Discover them only from the live server card and MCP
protocol. Do not infer hosted behavior from this repository's Git history.

## ProofRelay vs DeFi Safety

ProofRelay is about evidence and action-control metadata. DeFi safety tooling is
about smart-contract, protocol, wallet, liquidity, oracle, bridge, and token
risk. Those are different domains.

ProofRelay may help an agent notice that a financial or wallet-related action
needs review, or that a bundle lacks a required authority envelope. It does not
audit contracts, verify liquidity, price assets, validate token economics,
score protocol risk, or make custody decisions.

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

ProofRelay verifies submitted synthetic or non-confidential evidence bundle
shape and integrity signals. It does not process payments, custody funds,
escrow assets, certify legal/title/compliance status, certify real-world facts,
provide legal advice, review private source code, or require source-code
disclosure.

Do not submit secrets, private prompts, raw logs, source code, customer files,
wallet keys, payment credentials, or tenant traces to the public MCP endpoint.

## Public Repository Boundary

This archived repository is intentionally limited to public ProofRelay MCP
discovery, setup, and trust-boundary documentation. The hosted MCP service is
operated separately by GENESIS at `mcp.genesisre.io`.

This repository does not include:

- internal GENESIS monorepo code
- production deployment automation
- private credentials or environment files
- paid settlement adapters
- Skyfire, Coinbase, Stripe, AWS, or internal operator secrets
- customer data, raw logs, prompts, traces, or evidence bundles
- a local MCP server, SDK, verifier, container, or deployable package

See [PUBLICATION_BOUNDARY.md](PUBLICATION_BOUNDARY.md) for the publication
allowlist and exclusion policy.

## License

MIT. See [LICENSE](LICENSE).
