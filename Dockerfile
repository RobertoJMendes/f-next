# Imagem base leve do Node.js 20 rodando sobre Alpine Linux
FROM node:20-alpine AS base

# ==============================================================================
# ESTÁGIO 1: Instalação de Dependências
# ==============================================================================
FROM base AS deps
# Instala biblioteca de compatibilidade necessária para alguns pacotes no Alpine Linux
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copia apenas os arquivos de dependências primeiro (aproveita o cache do Docker)
COPY package.json package-lock.json ./
# Instala as dependências exatamente conforme travado no package-lock.json
RUN npm ci

# ==============================================================================
# ESTÁGIO 2: Compilação (Build) do Projeto Next.js
# ==============================================================================
FROM base AS builder
WORKDIR /app

# Traz a pasta node_modules instalada no estágio anterior
COPY --from=deps /app/node_modules ./node_modules
# Copia o restante do código-fonte do projeto
COPY . .

# Desativa a coleta de telemetria anônima da Vercel durante o build
ENV NEXT_TELEMETRY_DISABLED=1

# Gera a versão otimizada de produção (pasta .next/standalone)
RUN npm run build

# ==============================================================================
# ESTÁGIO 3: Imagem Final de Execução (Produção)
# ==============================================================================
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Cria um grupo e um usuário sem privilégios de administrador (boa prática de segurança)
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copia apenas os arquivos estáticos e o servidor mínimo gerado pelo modo standalone
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Define que o container será executado pelo usuário restrito 'nextjs'
USER nextjs

# Expõe a porta padrão do Next.js
EXPOSE 3000
ENV PORT=3000
# Permite que o servidor aceite conexões externas ao container
ENV HOSTNAME="0.0.0.0"

# Comando que inicia o servidor Next.js em produção
CMD ["node", "server.js"]
