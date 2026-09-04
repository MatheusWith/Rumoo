# ---- Dev stage ----
FROM node:22-bookworm-slim AS dev
RUN corepack enable && corepack prepare pnpm@11.3.0 --activate
WORKDIR /app
COPY frontend/package.json frontend/pnpm-lock.yaml frontend/pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile
COPY frontend/ .
EXPOSE 4200
CMD ["pnpm", "start"]

# ---- Prod build stage ----
FROM dev AS build
ARG KEYCLOAK_URL
ARG KEYCLOAK_REALM
ARG KEYCLOAK_CLIENT_ID
ENV KEYCLOAK_URL=$KEYCLOAK_URL \
    KEYCLOAK_REALM=$KEYCLOAK_REALM \
    KEYCLOAK_CLIENT_ID=$KEYCLOAK_CLIENT_ID \
    CI=true
RUN pnpm run build

# ---- Prod runtime stage ----
FROM nginx:alpine AS prod
COPY deploy/nginx/prod.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html
EXPOSE 8080
