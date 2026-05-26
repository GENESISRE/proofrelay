# Glama Release Wrapper

This repository contains a public-safe Docker wrapper for the hosted GENESIS
ProofRelay MCP server.

The actual read-only MCP service is hosted at:

- `https://mcp.genesisre.io/mcp`

The Dockerfile uses `mcp-remote` to expose that remote `streamable-http` MCP
endpoint as a local stdio MCP process for Glama release/build checks.

## Glama Dockerfile Admin Settings

Use the repository root Dockerfile and the latest `main` commit or stable tag.

Recommended command array:

```json
["mcp-remote", "https://mcp.genesisre.io/mcp", "--transport", "http-only", "--silent"]
```

If Glama uses the Dockerfile directly, the command above is already set as the
Dockerfile `CMD`.

## Release Flow

1. Open the Glama Dockerfile admin page for `GENESISRE/proofrelay`.
2. Sync the server with GitHub so Glama sees the latest commit/tag.
3. Select the repository root Dockerfile.
4. Run **Deploy**.
5. After the build/test succeeds, click **Make Release** and publish a version.

## Boundary

This wrapper does not duplicate private GENESIS server implementation code. It
only launches a public bridge to the hosted read-only MCP endpoint.

Do not add secrets, private keys, customer data, raw evidence bundles, or
production deployment automation to this repository.
