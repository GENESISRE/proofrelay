FROM node:22-slim

LABEL org.opencontainers.image.title="GENESIS ProofRelay MCP Glama Local Server"
LABEL org.opencontainers.image.description="Public-safe local stdio MCP server for GENESIS ProofRelay Glama release checks."
LABEL org.opencontainers.image.source="https://github.com/GENESISRE/proofrelay"
LABEL org.opencontainers.image.url="https://glama.ai/mcp/servers/GENESISRE/proofrelay"
LABEL org.opencontainers.image.licenses="MIT"

ENV NODE_ENV=production
WORKDIR /app

COPY package.json ./
COPY src ./src
COPY scripts ./scripts

RUN npm run smoke

USER node

CMD ["node", "src/server.mjs"]
