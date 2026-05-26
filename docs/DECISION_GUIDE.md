# ProofRelay Decision Guide

ProofRelay is a public-safe evidence and checkpoint layer for agents. It helps
answer narrow process questions:

- Does this action class need a checkpoint before reliance?
- Does this non-confidential bundle metadata have the expected shape?
- Does the public MCP metadata contain risk signals that deserve review?
- Did the workflow keep secrets and customer data out of the public path?

It does not answer whether an event happened in the real world, whether a legal
standard is satisfied, whether a DeFi protocol is safe, or whether a vendor is
endorsed.

## Simple Decision Vocabulary

Use the same small vocabulary in prompts, CLI wrappers, and operator logs:

| Word | Use it for | Do not use it for |
| --- | --- | --- |
| `checkpoint` | A required pause before relying on a higher-impact action. | A guarantee that the action is correct. |
| `authority_envelope` | Bounded metadata showing who or what is allowed to perform an action. | A legal opinion, signature ceremony, or real-world identity proof. |
| `evidence_bundle` | Public-safe metadata, hashes, receipt references, and ordering signals. | Raw logs, prompts, customer files, source code, credentials, or private traces. |
| `pass` | The submitted metadata satisfied the local public-safe check. | Truth certification or endorsement. |
| `needs_review` | The action or bundle is missing authority, has mismatch signals, or crosses a higher-reliance boundary. | Failure of the underlying business process. |
| `fail` | Required bundle metadata is inconsistent or missing. | A claim that a person, protocol, property, or vendor is unsafe. |
| `skipped` | No checkpoint applies for the supplied low-reliance action class. | Silent approval. |

## Tool Table

| Tool | Purpose | When to use | Safety notes |
| --- | --- | --- | --- |
| `proofrelay.get_verifier_status` | Confirms public discovery metadata for ProofRelay. | At startup, during listing checks, or before showing integration instructions. | Returns public URLs and boundary notes only. It does not inspect private systems. |
| `proofrelay.recommend_checkpoint` | Maps an action class to `pass`, `needs_review`, or `skipped` style guidance. | Before `paid_tool_call`, `revenue_action`, `financial_transaction`, `external_reliance`, or similar higher-reliance steps. | Advisory checkpoint recommendation only. It does not grant authority or approve spending. |
| `proofrelay.verify_bundle` | Checks synthetic or non-confidential bundle metadata for expected public-safe shape. | After a bundle fixture exists and before an agent or operator relies on it. | Submit metadata, hashes, and references only. Never submit secrets, raw logs, prompts, source code, wallet keys, payment credentials, or customer files. |
| `proofrelay.scan_mcp_risk` | Reviews caller-supplied public MCP descriptor metadata for advisory signals such as mutation, payment language, wallet language, credential language, or missing metadata. | Before registering, listing, or trusting an MCP server in an agent workflow. | It does not fetch the server, exploit anything, or certify security. |
| `proofrelay.describe_cli_sdk_helper` | Describes the helper pattern for wrapping actions with `pass`, `fail`, `needs_review`, and `skipped` outcomes. | When building a CLI, SDK, or agent wrapper around checkpointed actions. | Documentation and integration guidance only. |

## Case Study: Paid Tool Evidence Bundle Mismatch

An agent is preparing to call a paid external tool to generate or verify a
closing proof-pack artifact. The workflow should not move directly from
"tool is available" to "tool output is relied on." The paid call crosses a
reliance boundary.

Public-safe inputs:

```json
{
  "action_class": "paid_tool_call",
  "has_authority_envelope": false
}
```

Expected decision:

- `proofrelay.recommend_checkpoint` should route the action to review because a
  paid tool call needs bounded authority before reliance.
- The agent should not describe the checkpoint as payment approval, vendor
  endorsement, or proof that the tool output is true.

Now assume a bundle fixture is created, but the receipt references are out of
order or do not match the claimed checkpoint:

```json
{
  "bundle_id": "demo-paid-tool-mismatch",
  "checkpoint": "paid_tool_call",
  "authority_envelope": null,
  "receipts": [
    { "id": "receipt-002", "hash": "hash_b" },
    { "id": "receipt-001", "hash": "hash_a" }
  ]
}
```

Expected handling:

1. Keep the bundle public-safe: metadata, hashes, and receipt IDs only.
2. Call `proofrelay.verify_bundle` with the non-confidential fixture.
3. Treat missing authority or receipt-ordering mismatch as `needs_review` or
   `fail`, depending on the verifier response.
4. Route the issue to an operator or stronger private verification path.
5. Record the outcome as a process-control result, not as a real-world truth
   result.

The useful outcome is not "ProofRelay proved the tool is correct." The useful
outcome is "the agent found a mismatch before relying on a paid external action."

## ProofRelay vs DeFi Safety

ProofRelay and DeFi safety tools can both appear near financial workflows, but
they have different responsibilities.

| Area | ProofRelay | DeFi safety tooling |
| --- | --- | --- |
| Primary concern | Evidence bundle metadata, checkpoint decisions, receipt ordering, and public MCP risk metadata. | Smart contracts, wallets, assets, liquidity, bridges, protocols, governance, oracle behavior, and market risk. |
| Typical question | "Should this agent pause before relying on this action or bundle?" | "Is this protocol, contract, token, route, or wallet interaction risky?" |
| Output type | Public-safe process signal such as `pass`, `needs_review`, `fail`, or `skipped`. | Security, protocol, transaction, liquidity, or market-risk analysis. |
| Non-claim | Does not certify real-world truth, title, legal sufficiency, endorsement, custody safety, or investment safety. | Does not usually provide evidence-bundle process controls for non-DeFi workflows. |

Use ProofRelay before reliance on evidence or agent actions. Use specialized
DeFi safety systems for DeFi protocol, wallet, transaction, and asset-risk
analysis.

## Public-Safe Data Rule

Use ProofRelay with synthetic or non-confidential metadata only. Do not submit:

- secrets or private keys
- raw prompts or private chain-of-thought
- raw logs, traces, or telemetry
- source code or proprietary configuration
- customer files or tenant data
- wallet keys or payment credentials
- raw evidence bundles containing confidential material

If a workflow needs private review, keep ProofRelay's public result as a
checkpoint signal and route the underlying material to an appropriate private
verification path.
