FROM node:22-slim

LABEL org.opencontainers.image.title="GENESIS ProofRelay MCP Glama Wrapper"
LABEL org.opencontainers.image.description="Public-safe stdio bridge to the hosted GENESIS ProofRelay MCP streamable HTTP endpoint."
LABEL org.opencontainers.image.source="https://github.com/GENESISRE/proofrelay"
LABEL org.opencontainers.image.url="https://glama.ai/mcp/servers/GENESISRE/proofrelay"
LABEL org.opencontainers.image.licenses="MIT"

ENV NODE_ENV=production
ENV MCP_REMOTE_CONFIG_DIR=/tmp/proofrelay-mcp-auth

RUN npm install --global mcp-remote@0.1.38 \
    && npm cache clean --force

USER node

CMD ["mcp-remote", "https://mcp.genesisre.io/mcp", "--transport", "http-only", "--silent"]
