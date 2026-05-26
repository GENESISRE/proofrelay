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
- public Docker wrapper that bridges Glama release checks to the hosted
  read-only MCP endpoint without embedding private implementation code

## Excluded

- monorepo application source outside this public export
- private deployment scripts
- runtime environment files
- credentials, tokens, keys, secrets, or sample bearer values
- customer data, prompts, logs, traces, evidence bundles, or transaction files
- private payment, custody, settlement, or charge adapters
- internal operator dashboards or Hermes Agent City control-room material
- legal, title, compliance, or real-world-fact certification claims

## Public Safety Rule

If a file is not needed for public ProofRelay MCP discovery, setup, or Glama
release checks, it does not belong in this repository.
