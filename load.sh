#! /bin/bash

cat initdb.sql | docker exec -i postgres_service psql -U sa -d uberfake