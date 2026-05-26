# GENESIS ProofRelay MCP

Public discovery package for the GENESIS ProofRelay MCP verifier.

[![Smithery](https://smithery.ai/badge/genesis/proof-relay)](https://smithery.ai/servers/genesis/proof-relay)
[![proofrelay MCP server](https://glama.ai/mcp/servers/GENESISRE/proofrelay/badges/card.svg)](https://glama.ai/mcp/servers/GENESISRE/proofrelay)
[![proofrelay MCP score](https://glama.ai/mcp/servers/GENESISRE/proofrelay/badges/score.svg)](https://glama.ai/mcp/servers/GENESISRE/proofrelay)

ProofRelay is a read-only MCP verifier for synthetic or non-confidential
evidence bundle metadata. It helps agents and operators decide when an action
needs a checkpoint, review public-safe bundle shape, and flag MCP metadata that
deserves extra caution before reliance.

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

## Decision Vocabulary

Use these statuses consistently:

| Status | Meaning | Typical next step |
| --- | --- | --- |
| `pass` | The public-safe metadata satisfies the local check. | Continue, while preserving the evidence reference. |
| `needs_review` | The action or bundle has missing, ambiguous, or higher-reliance signals. | Pause for operator, policy, or stronger evidence review. |
| `skipped` | The action class is low-reliance or no checkpoint applies. | Continue without treating the result as verified. |
| `fail` | The bundle shape or required metadata is inconsistent. | Do not rely on the bundle until corrected. |

See [docs/DECISION_GUIDE.md](docs/DECISION_GUIDE.md) for practical examples,
including a paid-tool mismatch case study.

## Public Tool Surface

The local package exposes a small read-only MCP surface for public release and
discovery checks. The hosted MCP service remains available at
`https://mcp.genesisre.io/mcp`.

| Tool | Purpose | When to use | Safety boundary |
| --- | --- | --- | --- |
| `proofrelay.get_verifier_status` | Return public ProofRelay discovery metadata, URLs, counts, and boundary notes. | First call in a client or listing check. | No authentication, no mutation, no private evidence required. |
| `proofrelay.recommend_checkpoint` | Decide whether an action class should be checkpointed. | Before paid tool calls, revenue actions, financial transactions, external reliance, or closing-workflow steps. | Advisory only; it does not approve the action or certify authority. |
| `proofrelay.verify_bundle` | Check public-safe evidence bundle metadata for expected shape and consistency. | After an agent has a synthetic or non-confidential bundle fixture. | Do not submit secrets, prompts, raw logs, source code, customer files, wallet keys, payment credentials, or tenant traces. |
| `proofrelay.scan_mcp_risk` | Inspect caller-supplied public MCP descriptor metadata for advisory risk signals. | Before registering, listing, or relying on an MCP server. | Does not fetch the server URL and is not a security certification. |
| `proofrelay.describe_cli_sdk_helper` | Explain the invisible pass/fail/review helper pattern for wrapping actions. | When integrating ProofRelay-style checkpoints into agents or CLIs. | Documentation helper only; no production decision is made by the helper text. |

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

## Practical Demo: Paid Tool Evidence Mismatch

Scenario: an agent plans a paid external tool call for a closing proof-pack
step. The action class is `paid_tool_call`, but the submitted bundle metadata
does not include a bounded authority envelope or matching receipt ordering.

Expected ProofRelay-style handling:

1. Call `proofrelay.recommend_checkpoint` with `action_class:
   "paid_tool_call"`.
2. If the response is `needs_review`, do not treat the tool call as approved.
3. Build or correct a public-safe evidence bundle using only metadata, hashes,
   and receipt references.
4. Call `proofrelay.verify_bundle`.
5. Continue only if the result is `pass`; otherwise route the mismatch to an
   operator or stronger verification path.

This flow checks process integrity signals. It does not prove the underlying
real-world facts, certify legal sufficiency, or endorse the paid tool provider.

## Trust Boundary

ProofRelay verifies submitted synthetic or non-confidential evidence bundle
shape and integrity signals. It does not process payments, custody funds,
escrow assets, certify legal/title/compliance status, certify real-world facts,
provide legal advice, review private source code, or require source-code
disclosure.

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
