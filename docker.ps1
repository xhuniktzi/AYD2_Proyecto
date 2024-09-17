docker pull postgres

docker run --name libra-alpha-postgres -e POSTGRES_USER=sa -e POSTGRES_PASSWORD=database123! -e POSTGRES_DB=uberfake -p 5432:5432 -d postgres


