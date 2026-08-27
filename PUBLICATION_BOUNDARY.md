# Publication Boundary

This archived public repository is a documentation-only, allowlisted snapshot
for ProofRelay MCP discovery. It is not a source mirror or implementation.

## Allowed

- README and public setup instructions
- public Smithery listing link
- public Glama listing link and badges
- public MCP endpoint and health URLs
- public MCP server-card URL
- public service descriptor URL
- public non-claims and safety boundary
- public license, security policy, and contribution policy
- synthetic or public-safe discovery, checkpoint, and boundary examples

## Excluded

- monorepo application source outside this public export
- private deployment scripts
- runtime environment files
- credentials, tokens, keys, secrets, or sample bearer values
- customer data, prompts, logs, traces, evidence bundles, or transaction files
- private payment, custody, settlement, or charge adapters
- internal operator dashboards or Hermes Agent City control-room material
- legal, title, compliance, or real-world-fact certification claims
- executable source, package manifests, lockfiles, containers, deployment
  definitions, or local verifier substitutes

## Relationship to the Hosted MCP Surface

This repository does not track the hosted MCP surface. The hosted endpoint may
change at any time. Its tool names, schemas, and descriptions must be discovered
from the live server card and MCP protocol, never inferred from this snapshot.

## Public Safety Rule

If a file is executable or is not needed for archived public discovery and
trust-boundary documentation, it does not belong in this repository.
