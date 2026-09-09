#!/usr/bin/env bash
set -euo pipefail

if ! psql -U "$POSTGRES_USER" -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname = 'keycloak'" | grep -q 1; then
  createdb -U "$POSTGRES_USER" keycloak
fi