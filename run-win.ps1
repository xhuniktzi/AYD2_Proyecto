function Dev {
    $env:COMPOSE_PROFILES = "dev"
    docker-compose up --build --watch
}

function Prod {
    $env:COMPOSE_PROFILES = "prod"
    docker-compose up --build
}

function Clean {
    $env:COMPOSE_PROFILES = "prod,dev"
    docker-compose down -v
}

# Ejecutar la función basada en el argumento proporcionado
if ($args.Count -gt 0) {
    $action = $args[0]
    if (Get-Command $action -ErrorAction SilentlyContinue) {
        & $action
    } else {
        Write-Host "La función '$action' no existe."
    }
} else {
    Write-Host "Por favor, proporciona una acción (Dev, Prod, Clean)."
}
