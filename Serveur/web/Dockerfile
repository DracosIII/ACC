FROM node:25-alpine AS builder

WORKDIR /app

# Copie des fichiers package.json et variables
COPY package*.json ./
RUN npm ci

# Copie du reste de l'application
COPY . .

# Construction du front-end React avec Vite
RUN npm run build

FROM node:25-alpine AS runner

WORKDIR /app

# Installation de dépendances de prod uniquement
COPY package*.json ./
RUN npm ci --omit=dev

# Copier le dist (Frontend compilé) et le serveur (Backend)
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server ./server
COPY --from=builder /app/types.ts ./types.ts

EXPOSE 4000

ENV NODE_ENV=production

CMD ["node", "server/index.js"]
