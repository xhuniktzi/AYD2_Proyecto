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

## Endpoints

### **Autenticación y Registro**

**Base URL**: `/api/auth`

#### **1. Iniciar Sesión**

- **Endpoint**: `/login`
- **Método HTTP**: `POST`
- **Descripción**: Autentica a un usuario y proporciona un token de acceso JWT para futuras solicitudes.
  
**Cuerpo de la solicitud (JSON)**:

```json
{
  "username": "nombre_usuario_opcional",
  "email": "correo_opcional",
  "password": "contraseña_requerida"
}
```

- **Nota**: Debe proporcionar `username` o `email`.

**Respuesta Exitosa (200 OK)**:

```json
{
  "access_token": "token_jwt_generado"
}
```

**Respuestas de Error**:

- `401 Unauthorized`:

  ```json
  {
    "msg": "Bad credentials"
  }
  ```

---

#### **2. Registrar Usuario**

- **Endpoint**: `/register`
- **Método HTTP**: `POST`
- **Descripción**: Registra un nuevo usuario en el sistema.
  
**Cuerpo de la solicitud (JSON)**:

```json
{
  "fullname": "Nombre Completo",
  "fecha_nac": "dd/mm/yyyy",
  "password": "contraseña",
  "genero": 1,
  "email": "correo@ejemplo.com",
  "phone": "1234567890"
}
```

- **Campos Requeridos**:
  - `fullname`: Nombre completo del usuario.
  - `fecha_nac`: Fecha de nacimiento en formato `dd/mm/yyyy`.
  - `password`: Contraseña para la cuenta.
  - `genero`: Identificador de género (0: ninguno, 1: femenino, 2: masculino).
  - `email`: Correo electrónico único.
  - `phone`: Número de teléfono único.

**Respuesta Exitosa (200 OK)**:

```json
{
  "msg": "Usuario registrado",
  "username": "NombreUsuarioGenerado"
}
```

**Respuestas de Error**:

- `400 Bad Request`:

  ```json
  {
    "msg": "Formato de fecha inválido. Utiliza dd/mm/yyyy"
  }
  ```

---

#### **3. Verificar Cuenta**

- **Endpoint**: `/verify`
- **Método HTTP**: `GET`
- **Descripción**: Verifica la cuenta de un usuario utilizando un token enviado por correo electrónico.
  
**Parámetros de Consulta (Query Params)**:

- `token`: Token de verificación proporcionado al usuario.

**Respuesta Exitosa (200 OK)**:

```json
{
  "msg": "Cuenta verificada exitosamente"
}
```

**Respuestas de Error**:

- `400 Bad Request`:

  ```json
  {
    "msg": "Token inválido"
  }
  ```

- `400 Bad Request`:

  ```json
  {
    "msg": "El token ha expirado"
  }
  ```

- `404 Not Found`:

  ```json
  {
    "msg": "Usuario no encontrado"
  }
  ```

---

#### **4. Olvidó su Contraseña**

- **Endpoint**: `/forgot_password`
- **Método HTTP**: `POST`
- **Descripción**: Inicia el proceso para restablecer la contraseña del usuario.
  
**Cuerpo de la solicitud (JSON)**:

```json
{
  "email": "correo@ejemplo.com_opcional",
  "username": "nombre_usuario_opcional"
}
```

- **Nota**: Debe proporcionar `email` o `username`.

**Respuesta Exitosa (200 OK)**:

```json
{
  "msg": "Se ha enviado un email con instrucciones para restablecer su contraseña"
}
```

**Respuestas de Error**:

- `404 Not Found`:

  ```json
  {
    "msg": "No se encontró una cuenta con ese email"
  }
  ```

---

#### **5. Restablecer Contraseña**

- **Endpoint**: `/reset_password`
- **Método HTTP**: `POST`
- **Descripción**: Restablece la contraseña del usuario utilizando el token de restablecimiento.
  
**Cuerpo de la solicitud (JSON)**:

```json
{
  "token": "token_de_reset",
  "new_password": "nueva_contraseña"
}
```

**Respuesta Exitosa (200 OK)**:

```json
{
  "msg": "Contraseña restablecida exitosamente"
}
```

**Respuestas de Error**:

- `400 Bad Request`:

  ```json
  {
    "msg": "Token inválido"
  }
  ```

- `400 Bad Request`:

  ```json
  {
    "msg": "El token ha expirado"
  }
  ```

- `404 Not Found`:

  ```json
  {
    "msg": "Usuario no encontrado"
  }
  ```

---

### **Notas Adicionales**

- **Autenticación**: Los endpoints de autenticación (`/login`, `/register`, `/forgot_password`, `/reset_password`, `/verify`) no requieren token JWT.

- **Tokens JWT**: El token JWT obtenido al iniciar sesión debe incluirse en las cabeceras de las solicitudes a endpoints protegidos utilizando el esquema `Bearer`.

  ```txt
  Authorization: Bearer <token_jwt>
  ```

- **Formato de Fecha**: Las fechas deben proporcionarse en el formato `dd/mm/yyyy`.

- **Género (`genero`)**: Valores permitidos:
  - `0`: Ninguno
  - `1`: Femenino
  - `2`: Masculino

- **Estado del Usuario**: Después del registro, el usuario se encuentra en estado "no verificado". Debe verificar su cuenta utilizando el endpoint `/verify`.
