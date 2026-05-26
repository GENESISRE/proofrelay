# Glama Local Release Server

This repository contains a public-safe local stdio MCP server for Glama release
checks.

The local server exposes a small public ProofRelay discovery and readiness
surface. The full hosted read-only MCP service remains available at:

- `https://mcp.genesisre.io/mcp`

## Glama Dockerfile Admin Settings

Glama does not allow `mcp-remote` or remote proxy launchers for release checks.
Use the local server entrypoint instead.

Build steps:

```json
[]
```

CMD arguments:

```json
["node", "src/server.mjs"]
```

Environment variables JSON schema:

```json
{
  "properties": {},
  "required": [],
  "type": "object"
}
```

Placeholder parameters:

```json
{}
```

If Glama uses the repository Dockerfile directly, the command above is already
set as the Dockerfile `CMD`.

## Release Flow

1. Open the Glama Dockerfile admin page for `GENESISRE/proofrelay`.
2. Sync the server with GitHub so Glama sees the latest commit/tag.
3. Use the repository root Dockerfile or the local CMD above.
4. Run **Deploy**.
5. After the build/test succeeds, click **Make Release** and publish a version.
6. Use **Try in Browser** once to seed a usage signal.

## Boundary

This local server does not duplicate private GENESIS server implementation code.
It exposes public-safe discovery, checkpoint recommendation, bundle-shape
validation, MCP risk metadata review, and helper-description tools only.

Do not add secrets, private keys, customer data, raw evidence bundles, private
prompts, raw logs, wallet keys, payment credentials, or production deployment
automation to this repository.
