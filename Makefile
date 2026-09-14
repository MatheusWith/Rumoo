# Rumoo dev environment

.PHONY: up up-no-seed seed down logs

up:
	cd deploy && docker compose -f docker-compose.dev.yml up -d

up-no-seed:
	cd deploy && SEED_ENABLED=false docker compose -f docker-compose.dev.yml up -d

seed:
	cd deploy && docker compose -f docker-compose.dev.yml run --rm seed

down:
	cd deploy && docker compose -f docker-compose.dev.yml down

logs:
	cd deploy && docker compose -f docker-compose.dev.yml logs -f