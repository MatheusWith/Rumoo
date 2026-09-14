# Dev Seed

Populates the dev environment with deterministic, idempotent data:

- **Domain** — 2 Companies, 3 Groups, 6 Collaborators and Group memberships
  (`Member`/`Leader`), inserted into the `rumoo` database via `psql`.
- **Auth** — 2 Keycloak realm users (one `admin` composite, one `collaborator`
  composite) created via the Admin REST API, with their `sub` backfilled into
  the matching Collaborators' `keycloakSub`.

Runs automatically on the **first** `docker compose up` of the dev stack
(`restart: no`, waits for PostgreSQL and Keycloak health). Subsequent `up`
commands reuse the exited container and do **not** re-run it.

## Commands (from repo root)

| Command | Effect |
|---|---|
| `make up` | Start the stack; seed runs on first start |
| `make up-no-seed` | Start the stack without seeding (`SEED_ENABLED=false`) |
| `make seed` | Re-run the seed on demand |

## Configuration

Read from `deploy/.env` (see `deploy/.env.example`):

| Var | Default | Meaning |
|---|---|---|
| `SEED_ENABLED` | `true` | Set to `false` to skip seeding entirely |
| `SEED_PASSWORD` | `Password123!` | Dev password for the seed Keycloak users |

Seed users are listed in `seed-users.env` as `email|realm-composite-role`.
Each email must match a Collaborator in `seed.sql` so the `keycloakSub`
backfill finds its row.

## Idempotency

- Domain inserts use `ON CONFLICT DO NOTHING` keyed on PKs.
- Keycloak users are created only if the username does not exist; the composite
  role mapping is re-applied every run.
- `keycloakSub` is only written where still `NULL`.

## Verify

```sh
# Validate the dev overlay
docker compose -f deploy/docker-compose.dev.yml config

PG_SQL="select name, email, coalesce(keycloak_sub,'<null>') as sub from collaborators order by id;"
docker exec -i $(docker compose -f deploy/docker-compose.dev.yml ps -q postgres) \
  psql -U rumoo -d rumoo -c "${PG_SQL}"

# Group memberships (expect 8 rows; composite key)
docker exec -i $(docker compose -f deploy/docker-compose.dev.yml ps -q postgres) \
  psql -U rumoo -d rumoo -c "select c.name, g.name, gm.role from group_memberships gm join collaborators c on c.id=gm.collaborator_id join groups g on g.id=gm.group_id order by c.id, g.id;"

# Keycloak users exist with the expected composite roles (via Admin API)
TOKEN=$(curl -sf -X POST http://localhost:8080/auth/realms/master/protocol/openid-connect/token \
  -d "client_id=admin-cli" -d "username=${KEYCLOAK_ADMIN}" -d "password=${KEYCLOAK_ADMIN_PASSWORD}" \
  -d "grant_type=password" | jq -r .access_token)
for u in "alice@rumoo.com:admin" "carol@acme.io:collaborator"; do
  email="${u%%:*}"; role="${u##*:}"
  uid=$(curl -sf -H "Authorization: Bearer ${TOKEN}" \
    "http://localhost:8080/auth/admin/realms/Rumoo/users?username=${email}" | jq -r '.[0].id')
  roles=$(curl -sf -H "Authorization: Bearer ${TOKEN}" \
    "http://localhost:8080/auth/admin/realms/Rumoo/users/${uid}/role-mappings/realm/composite" | jq -c '[.[].name] | sort')
  echo "${email}: ${roles}"
done
```

Expected: 2 Company-keyed groups per company, 6 Collaborators, 8 memberships,
`alice@rumoo.com` effective roles include the `collaborator:*` and `company:*`
atomics, `carol@acme.io` effective roles include `collaborator:read` and
`company:read`.