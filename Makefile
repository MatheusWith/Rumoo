# Rumoo dev environment

.PHONY: up up-build up-no-seed seed down logs

up:
	cd deploy && docker compose -f docker-compose.dev.yml up -d

up-build:
	cd deploy && docker compose -f docker-compose.dev.yml up -d --build

up-no-seed:
	cd deploy && SEED_ENABLED=false docker compose -f docker-compose.dev.yml up -d

seed:
	cd deploy && docker compose -f docker-compose.dev.yml run --rm seed

down:
	cd deploy && docker compose -f docker-compose.dev.yml down --remove-orphans

logs:
	cd deploy && docker compose -f docker-compose.dev.yml logs -f