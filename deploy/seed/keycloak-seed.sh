#!/bin/sh
# Creates the Keycloak seed users via the Admin REST API (idempotent) and prints
# "email=sub" lines so the entrypoint can backfill collaborators.keycloak_sub.
set -euo pipefail

KEYCLOAK_BASE_URL="${KEYCLOAK_BASE_URL:-http://keycloak:8080}"
KEYCLOAK_ADMIN="${KEYCLOAK_ADMIN:?KEYCLOAK_ADMIN is required}"
KEYCLOAK_ADMIN_PASSWORD="${KEYCLOAK_ADMIN_PASSWORD:?KEYCLOAK_ADMIN_PASSWORD is required}"
KEYCLOAK_REALM="${KEYCLOAK_REALM:-Rumoo}"
SEED_PASSWORD="${SEED_PASSWORD:-Password123!}"
SEED_USERS_FILE="${SEED_USERS_FILE:-/seed/seed-users.env}"

token="$(curl -sf -X POST \
  "${KEYCLOAK_BASE_URL}/auth/realms/master/protocol/openid-connect/token" \
  -d "client_id=admin-cli" \
  -d "username=${KEYCLOAK_ADMIN}" \
  -d "password=${KEYCLOAK_ADMIN_PASSWORD}" \
  -d "grant_type=password" \
  | jq -r '.access_token')"

if [ -z "${token}" ] || [ "${token}" = "null" ]; then
  echo "ERROR: failed to obtain Keycloak admin token" >&2
  exit 1
fi

realm_role_id() {
  role="$1"
  curl -sf -H "Authorization: Bearer ${token}" \
    "${KEYCLOAK_BASE_URL}/auth/admin/realms/${KEYCLOAK_REALM}/roles" \
    | jq -r --arg role "${role}" '.[] | select(.name == $role) | .id'
}

ensure_role() {
  role="$1"
  if [ -z "$(realm_role_id "${role}")" ]; then
    echo "ERROR: realm role '${role}' does not exist" >&2
    exit 1
  fi
}

user_id() {
  username="$1"
  curl -sf -H "Authorization: Bearer ${token}" \
    "${KEYCLOAK_BASE_URL}/auth/admin/realms/${KEYCLOAK_REALM}/users?username=${username}" \
    | jq -r '.[0].id // empty'
}

create_user() {
  email="$1"
  curl -sf -o /dev/null -X POST \
    -H "Authorization: Bearer ${token}" \
    -H "Content-Type: application/json" \
    -d "$(jq -n --arg email "${email}" --arg password "${SEED_PASSWORD}" \
      '{username: $email, email: $email, enabled: true, emailVerified: true,
        credentials: [{type: "password", value: $password, temporary: false}]}')" \
    "${KEYCLOAK_BASE_URL}/auth/admin/realms/${KEYCLOAK_REALM}/users"
}

assign_role() {
  uid="$1"
  role_id="$2"
  role="$3"
  curl -sf -o /dev/null -X POST \
    -H "Authorization: Bearer ${token}" \
    -H "Content-Type: application/json" \
    -d "$(jq -n --arg id "${role_id}" --arg name "${role}" '[{id: $id, name: $name}]')" \
    "${KEYCLOAK_BASE_URL}/auth/admin/realms/${KEYCLOAK_REALM}/users/${uid}/role-mappings/realm"
}

while IFS='|' read -r email role <&3; do
  case "${email}" in
    ''|'#'*) continue ;;
  esac

  ensure_role "${role}"

  uid="$(user_id "${email}")"
  if [ -z "${uid}" ]; then
    create_user "${email}"
    uid="$(user_id "${email}")"
    echo "created user ${email} (role ${role})" >&2
  else
    echo "user ${email} already exists (role ${role})" >&2
  fi

  assign_role "${uid}" "$(realm_role_id "${role}")" "${role}"

  echo "${email}=${uid}"
done 3< "${SEED_USERS_FILE}"