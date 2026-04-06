FROM node:20-alpine AS base

WORKDIR /app

COPY package*.json ./

FROM base AS production

RUN npm ci --only=production --ignore-scripts

COPY . .

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

USER nodejs

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/health || exit 1

CMD ["node", "src/server.js"]

FROM base AS development

RUN npm install

COPY . .

CMD ["npm", "run", "dev"]
