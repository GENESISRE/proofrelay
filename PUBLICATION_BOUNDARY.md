# Publication Boundary

This public repository is an allowlisted export for the ProofRelay MCP
marketplace and community surface.

## Allowed

- README and public setup instructions
- public Smithery listing link
- public Glama listing link and badges
- public MCP endpoint and health URLs
- public MCP server-card URL
- public service descriptor URL
- public non-claims and safety boundary
- public license, security policy, and contribution policy
- public local stdio MCP server for Glama release checks
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

## Relationship to the Hosted MCP Surface

This repository intentionally tracks only the public discovery, setup, and
local stdio subset. It may lag the hosted MCP endpoint
(https://mcp.genesisre.io/mcp), which can expose additional tools and
schemas before they are mirrored here. The hosted endpoint's tool names,
input/output schemas, and descriptions are public by construction; absence
of a tool from this repository does not mean it is non-public.

## Public Safety Rule

If a file is not needed for public ProofRelay MCP discovery, setup, or Glama
release checks, it does not belong in this repository.
