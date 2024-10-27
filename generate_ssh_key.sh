#!/bin/bash

# Nombre de la clave SSH
KEY_NAME="github_actions_key"

# Directorio donde se almacenará la clave
SSH_DIR="$HOME/.ssh"

# Ruta completa de la clave privada y pública
PRIVATE_KEY_PATH="$SSH_DIR/$KEY_NAME"
PUBLIC_KEY_PATH="$SSH_DIR/${KEY_NAME}.pub"

# Verificar si el directorio .ssh existe, si no, crearlo
if [ ! -d "$SSH_DIR" ]; then
  echo "Creando directorio $SSH_DIR ..."
  mkdir -p "$SSH_DIR"
  chmod 700 "$SSH_DIR"
fi

# Verificar si la clave privada ya existe
if [ -f "$PRIVATE_KEY_PATH" ]; then
  echo "La clave SSH '$PRIVATE_KEY_PATH' ya existe."
  read -p "¿Deseas sobrescribirla? (s/n): " overwrite
  if [[ "$overwrite" != "s" && "$overwrite" != "S" ]]; then
    echo "Proceso cancelado."
    exit 0
  fi
fi

# Generar una nueva clave SSH en formato PEM sin frase de contraseña
echo "Generando una nueva clave SSH en formato PEM..."
ssh-keygen -t rsa -b 4096 -m PEM -C "github-actions" -f "$PRIVATE_KEY_PATH" -N ""

# Verificar si la generación fue exitosa
if [ $? -ne 0 ]; then
  echo "Error al generar la clave SSH."
  exit 1
fi

# Establecer permisos restrictivos para la clave privada
chmod 600 "$PRIVATE_KEY_PATH"

# Mostrar la clave pública
echo ""
echo "===== CLAVE PÚBLICA ====="
cat "$PUBLIC_KEY_PATH"
echo "=========================="
echo ""

# Instrucciones para agregar la clave pública a EC2
echo "1. Copia la clave pública mostrada arriba."
echo "2. Conéctate a tu instancia EC2."
echo "3. Agrega la clave pública al archivo ~/.ssh/authorized_keys:"
echo ""
echo "   echo 'PEGA_AQUI_LA_CLAVE_PUBLICA' >> ~/.ssh/authorized_keys"
echo "4. Asegúrate de que los permisos sean correctos:"
echo "   chmod 700 ~/.ssh"
echo "   chmod 600 ~/.ssh/authorized_keys"
echo ""

# Instrucciones para agregar la clave privada como un secreto en GitHub
echo "===== INSTRUCCIONES PARA GITHUB ====="
echo "1. Ve a tu repositorio en GitHub."
echo "2. Navega a Settings > Secrets and variables > Actions."
echo "3. Haz clic en 'New repository secret'."
echo "4. Agrega un secreto llamado 'EC2_SSH_KEY' y pega el contenido de la clave privada:"
echo "   cat $PRIVATE_KEY_PATH"
echo "====================================="
echo ""

# Finalizar
echo "Proceso completado. Tu clave SSH ha sido generada y está lista para usarse."
