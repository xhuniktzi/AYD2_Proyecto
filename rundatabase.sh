#! /bin/bash

docker network create app-network
docker volume create db-volume

docker run -d \
  --name postgres_service \
  -e POSTGRES_USER=sa \
  -e POSTGRES_PASSWORD=database123! \
  -e POSTGRES_DB=uberfake \
  -p 5432:5432 \
  --network app-network \
  -v db-volume:/var/lib/postgresql/data \
  postgres

