FROM alpine:3.20

RUN apk add --no-cache postgresql-client curl jq

WORKDIR /seed
COPY seed.sql seed-users.env keycloak-seed.sh entrypoint.sh ./
RUN chmod +x entrypoint.sh keycloak-seed.sh

ENTRYPOINT ["./entrypoint.sh"]