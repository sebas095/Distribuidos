# Mensajes En La Comunicación

Existen distintos mensajes que van a usar tanto el cliente como el servidor
para realizar la comunicacion, tanto el cliente como el servidor deben conocer
estos mensajes para poder realizar la comunicacion exitosamente.

El cada mensaje se conforma por:

- **type:** id del mensaje que se va a enviar (number)
- **content:** contenido del mensaje a enviar (object)

## Mensajes Que Envia El Cliente
Estos mensajes son enviados cuando un usuario quiere realizar alguna accion
que tiene que realizar algún cambio en el servidor.

### CHAT [id = 0]
El mensaje CHAT lo envia un cliente para enviar un usuario a un cuarto
especifico, tiene el siguiente contenido:

- **user:** identificador de usuario (string)
- **room:** nombre del cuarto al que va dirigidos los mensajes (string)
- **message:** mensaje que se va enviar (string)

Ejemplo:
```json
{
    "type": 0,
    "content": {
        "user": "pepillo",
        "room": "default",
        "message": "HOLA MUNDO!"
    }
}
```

### LOGIN [id = 1]
El mensaje LOGIN lo envia el cliente cuando un usuario registrado va a acceder
al chat, tiene el siguiente contenido:

- **user:** identificador de usuario (string)
- **password:** contraseña del usuario (string)

Ejemplo:
```json
{
    "type": 1,
    "content": {
        "user": "pepillo",
        "password": "asdf1234"
    }
}
```

### REGISTER [id = 2]
El mensaje REGISTER lo envia el cliente cuando un usuario nuevo se quiere
registrar, tiene el siguiente contenido:

- **name:** nombre del usuario (string)
- **last_name:** apellido del usuario (string)
- **user:** identificador de usuario (string)
- **password:** contraseña del usuario (string)
- **age:** edad del usuario (number)
- **gender:** genero del usuario \["m", "f", "o"\] (string)

Ejemplo:
```json
{
    "type": 2,
    "content": {
        "name": "pepe",
        "last_name": "grillo",
        "user": "pepillo",
        "password": "asdf1234",
        "age": 40,
        "gender": "m"
    }
}
```

### CREATE_ROOM [id = 3]
El mensaje CREATE_ROOM lo envia el cliente cuando un usuario quiere crear un
cuarto de chat, tiene el siguiente contenido:

- **name:** nombre del cuarto (string)
- **owner:** identificador del usuario propietario (string)

Ejemplo:
```json
{
    "type": 3,
    "content": {
        "name": "El Mundo De Pepe",
        "owner": "pepillo"
    }
}
```

### REMOVE_ROOM [id = 4]
El mensaje CREATE_ROOM lo envia el cliente cuando un usuario quiere eliminar un
cuarto de chat, tiene el siguiente contenido:

- **name:** nombre del cuarto (string)
- **owner:** identificador del usuario propietario (string)

Ejemplo:
```json
{
    "type": 4,
    "content": {
        "name": "El Mundo De Pepe",
        "owner": "pepillo"
    }
}
```

>NOTA: Solo el usuario propietario del cuarto puede eliminarlo, esta
verificacion es hecha por el servidor para evitar errores, aunque el cliente
debe llevar registro de los cuartos y su propietario respectivo para así
no permitir borrar uno que no posea.

## Mensajes Que Envia El Servidor
Los mensajes que envia el servidor se dividen en dos: respuesta y actualización.

Los mensajes de respuesta los envia el servidor cuando el cliente pide realizar
una accion tal como crear un nuevo cuarto (**CREATE_ROOM**) o crear un nuevo
usuario (**REGISTER**)

Los mensajes de actualizacion los envia el servidor periodicamente ya sea para
notificarle al usuario un mensaje nuevo que ha llegado o actualizar la lista
de usuarios en un cuarto.

### RESPONSE [id = 100]
Repuesta enviada por el servidor despues de haber recibido alguna petición del
cliente, tiene el siguiente contenido:

- **msg_id**: la id del mensaje al cual se está respondiendo. (number)
- **code**: el codigo de estado de la respuesta, un valor diferente a 0
significa un fallo en la operación.

#### Codigos de respuesta
Los codigos de status para cada mensaje son:

- **OK [id = 0]:** cuando la peticion se pudo hacer exitosamente.
- **INVALID_CONTENT [id = 1]:** si la peticion que se envió no contiene.
los datos requeridos o alguno de ellos está vacio.
- **INVALID_USERNAME [id = 2]:** si el `user` no es un valor valido, usado
por REGISTER.
- **INVALID_LOGIN_INFO [id = 3]:** si se ingresa el usuario o contraseña
incorrectamente, usado por LOGIN.
- **USER_ALREADY_REGISTERED [id = 4]:** si el usuario ya está registrado, usado
por REGISTER.
- **ROOM_ALREADY_CREATED [id = 5]:** cuando ya existe un room con ese nombre,
usado por CREATE_ROOM.
- **NON_EXISTING_USER [id = 6]:** si el usuario no existe, usado por
CREATE_ROOM y REMOVE_ROOM.
- **NON_EXISTING_ROOM [id = 7]:** si el cuarto no exite, usado por
CREATE_ROOM y REMOVE_ROOM.
- **NOT_ROOM_OWNER [id = 8]:** cuando el `owner` no es el propietario del Room,
usado por REMOVE_ROOM.

Ejemplos:
```json
{
    "type": 100,
    "content": {
        "msg_id": 1,  // Respuesta a un mensaje LOGIN
        "code": 0     // Codigo de respuesta OK
    }
}
```
```json
{
    "type": 100,
    "content": {
        "msg_id": 1,  // Respuesta a un mensaje LOGIN
        "code": 3     // Codigo de respuesta INVALID_LOGIN_INFO
    }
}
```
