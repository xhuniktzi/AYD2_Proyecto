# Como ejecutar este proyecto

## Entornos

Este proyecto usa Pipenv para ejecutarse en un entorno aislado.

Para instalar pipenv de forma global usar:

```bash
pip install pipenv
pipenv --version
```

Es importante que la path de pip este agregada a la linea de comando del sistema operativo usado.

Para instalar los paquetes usar:

```bash
pipenv install --dev
pipenv install
```

Una vez instalado para entrar en el entorno virtual usar:

```bash
pipenv shell
```

Una vez dentro reconocera tanto los paquetes como los comandos que se haya instalado junto con los paquetes.

Es importante que el editor o IDE reconozca el interprete del entorno virtual que se crea en la carpeta de usuario segun el sistema operativo.

## Ejecutar servidor de desarrollo

Para ejecutar el servidor de desarrollo es necesario estar dentro del entorno virtual y ejecutar el comando:

```bash
py src/run.py
```

## Migraciones

Este proyecto usa Flask Migrate, una integración Flask y SQL Alchemy para generar automaticamente los modelos de base de datos.

Para usarlo la primera vez (esto solo lo debe hacer el primer usuario que lo ejecute):

```bash
flask db init
```

Para crear una migración (por ejemplo cada vez que se cambien los modelos):

```bash
flask db migrate -m "Descripción del cambio"
```

Para ejecutar la migración en la base de datos:

```bash
flask db upgrade
```

Para revertir una migración:

```bash
flask db downgrade
```

Para ver el estado actual de la migración:

```bash
flask db current
```