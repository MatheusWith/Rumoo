#!/bin/sh
# Seed entrypoint: populates the rumoo database (domain) and the Keycloak realm
# (users + roles), then backfills collaborators.keycloakSub. Idempotent.
set -euo pipefail

if [ "${SEED_ENABLED:-true}" != "true" ]; then
  echo "Seed disabled (SEED_ENABLED != true) — exiting without changes"
  exit 0
fi

: "${PGHOST:?PGHOST is required}"
: "${PGDATABASE:?PGDATABASE is required}"
: "${PGUSER:?PGUSER is required}"
: "${PGPASSWORD:?PGPASSWORD is required}"

echo "== Seeding rumoo database (${PGDATABASE}) =="
psql -v ON_ERROR_STOP=1 -f /seed/seed.sql

echo "== Seeding Keycloak users =="
mapping="$(mktemp)"
/seed/keycloak-seed.sh | tee "${mapping}"

echo "== Backfilling collaborators.keycloak_sub =="
while IFS='=' read -r email sub; do
  [ -z "${email}" ] && continue
  # SQL goes via stdin: psql interpolates :'var' only when reading a script,
  # never with -c.
  printf "UPDATE collaborators SET keycloak_sub = :'seed_sub' WHERE email = :'seed_email' AND keycloak_sub IS NULL;\n" \
    | psql -v ON_ERROR_STOP=1 -v seed_email="${email}" -v seed_sub="${sub}"
done < "${mapping}"
rm -f "${mapping}"

echo "== Seed complete =="