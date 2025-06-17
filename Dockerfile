# Étape 1 : Construction de l'image pour compiler le code TypeScript
FROM node:22-alpine AS builder
WORKDIR /opt/catalog

# Copier les fichiers package.json et package-lock.json et installer les dépendances
COPY package*.json ./
RUN npm install

# Copier le reste des fichiers nécessaires au build
COPY . .

# Compiler le TypeScript en JavaScript
RUN npm run build

# Étape 2 : Créer l'image finale en production
FROM node:22-alpine
WORKDIR /opt/catalog

# Installer OpenSSL
RUN apk add --no-cache openssl

# Copier uniquement les fichiers nécessaires depuis l'étape de build
COPY package*.json ./
COPY ./src/config ./src/config
RUN npm install --omit=dev

# Copier les fichiers compilés depuis l'étape précédente
COPY --from=builder /opt/catalog/dist ./dist
COPY openapi.yaml ./openapi.yaml

# Copier les fichiers Prisma (schéma et migrations)
COPY --from=builder /opt/catalog/prisma ./prisma

# Ajout des informations pour le package git
LABEL org.opencontainers.image.source=https://github.com/MAALSI23G1/CATALOGUE_API
LABEL org.opencontainers.image.description="Service Catalogue pour l'application Breizsport"
LABEL org.opencontainers.image.licenses=MIT

# Définir l'environnement en production
ENV NODE_ENV=production

# Commande de démarrage
CMD ["sh", "-c", "npx prisma generate && npm run seed && npm run start"]
