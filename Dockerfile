# Imagem para rodar o Librosistemo localmente (ver compose.yaml).
# Alvos: dev (hot reload) e prod (build otimizado).

FROM node:24-slim AS base
WORKDIR /app
COPY package.json yarn.lock ./
COPY prisma ./prisma
COPY prisma.config.ts tsconfig.json ./
# --ignore-scripts: o postinstall (prisma generate) roda depois, com o código presente
RUN yarn install --frozen-lockfile --ignore-scripts

FROM base AS dev
ENV NODE_ENV=development
COPY . .
RUN yarn db:generate
EXPOSE 3000
CMD ["sh", "-c", "yarn db:setup && yarn dev"]

FROM base AS build
COPY . .
RUN yarn db:generate && yarn build

FROM build AS prod
ENV NODE_ENV=production
EXPOSE 3000
CMD ["sh", "-c", "yarn db:setup && yarn start"]
