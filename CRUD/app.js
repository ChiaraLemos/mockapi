
document.addEventListener('DOMContentLoaded', function() {
    const btnGet1 = document.getElementById('btnGet1');
    const inputGet1Id = document.getElementById('inputGet1Id');
    const results = document.getElementById('results');

    const btnPost = document.getElementById('btnPost');
    const inputPostNombre = document.getElementById('inputPostNombre');
    const inputPostApellido = document.getElementById('inputPostApellido');

    const btnPut = document.getElementById('btnPut');
    const inputPutId = document.getElementById('inputPutId');
    const inputPutNombre = document.getElementById('inputPutNombre');
    const inputPutApellido = document.getElementById('inputPutApellido');

    const btnDelete = document.getElementById('btnDelete');
    const inputDelete = document.getElementById('inputDelete');

    
    // Evento para obtener un usuario específico o listar todos
    btnGet1.addEventListener('click', async function() {
        const userId = inputGet1Id.value.trim();

        if (userId) {
            await obtenerUsuario(userId);
        } else {
            await listarUsuarios();
        }
    });

    // Evento para agregar un nuevo usuario
    btnPost.addEventListener('click', async function() {
        const nombre = inputPostNombre.value.trim();
        const apellido = inputPostApellido.value.trim();

        if (nombre && apellido) {
            await agregarUsuario(nombre, apellido);
            await listarUsuarios(); // Actualizar la lista para incluir el nuevo registro
        } else {
            alert('Por favor, ingresa un nombre y apellido.');
        }
    });

    // Evento para eliminar un usuario
    btnDelete.addEventListener('click', async function() {
        const id = inputDelete.value.trim();

        if (id) {
            await eliminarUsuario(id);
            await listarUsuarios(); // Actualizar la lista para reflejar los cambios
        } else {
            alert('Por favor, ingresa un ID.');
        }
    });

    // Función para listar todos los usuarios
    async function listarUsuarios() {
        try {
            const response = await fetch('https://672dfcdbfd89797156448d36.mockapi.io/Users');
            const data = await response.json();
            console.log('Lista de usuarios:', data);
            displayUsers(data);
        } catch (error) {
            console.error('Error al listar usuarios:', error);
            mostrarAlertaError();
        }
    }

    // Función para obtener un usuario específico por ID
    async function obtenerUsuario(id) {
        try {
            const response = await fetch(`https://672dfcdbfd89797156448d36.mockapi.io/Users/${id}`);
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
            const data = await response.json();
            console.log('Usuario obtenido:', data); 
            displayUsers([data]);
        } catch (error) {
            console.error('Error al obtener el usuario:', error);
            mostrarAlertaError();
        }
    }

    // Función para agregar un nuevo usuario
    async function agregarUsuario(nombre, apellido) {
        try {
            const response = await fetch('https://672dfcdbfd89797156448d36.mockapi.io/Users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ Name: nombre, LastName: apellido })
            });
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`); //msj de error
            }
            const newUser = await response.json();
            console.log('Usuario agregado:', newUser);

            // Limpiar campos de entrada
            inputPostNombre.value = '';
            inputPostApellido.value = '';

            // Actualizar la lista de usuarios
            await listarUsuarios();
        } catch (error) {
            console.error('Error al agregar usuario:', error);
            mostrarAlertaError();
        }
    }


// Evento para modificar un usuario
btnPut.addEventListener('click', async function() {
    const userId = inputPutId.value.trim();
  
    if (userId) {
      try {
        // Obtener los datos del usuario a modificar
        const response = await fetch(`https://672dfcdbfd89797156448d36.mockapi.io/Users/${userId}`);
        const user = await response.json();
  
        // Mostrar los datos en el modal
        $('#inputPutNombre').val(user.Name);
        $('#inputPutApellido').val(user.LastName);
  
        // Mostrar el modal
        $('#dataModal').modal('show');
      } catch (error) {
        console.error('Error al obtener el usuario:', error);
        mostrarAlertaError();
      }
    } else {
      alert('Por favor, ingresa un ID.');
    }
  });
  
  // Evento para guardar los cambios en el modal
  $('#btnSendChanges').click(async function() {
    const id = inputPutId.value.trim();
    const nombre = $('#inputPutNombre').val();
    const apellido = $('#inputPutApellido').val();
  
    try {
      const response = await fetch(`https://672dfcdbfd89797156448d36.mockapi.io/Users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          Name: nombre,
          LastName: apellido
        })
      });
  
      if (!response.ok) {
        throw new Error('Error al actualizar el usuario');
      }

      // Cerrar el modal
      $('#dataModal').modal('hide');
  
      // Actualizar la lista de usuarios
      await listarUsuarios();
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);
      mostrarAlertaError();
    }
  });


    // Función para eliminar un usuario
    async function eliminarUsuario(id) {
        try {
            const response = await fetch(`https://672dfcdbfd89797156448d36.mockapi.io/Users/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
            const deletedUser = await response.json();
            console.log('Usuario eliminado:', deletedUser);

            // Limpiar campo de entrada
            inputDelete.value = '';

            // Actualizar la lista de usuarios
            await listarUsuarios();
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
            mostrarAlertaError();
        }
    }

    // Función para mostrar los usuarios en la lista
    function displayUsers(users) {
        results.innerHTML = ''; // Limpiar el contenido anterior

        if (!users || users.length === 0) {  //si no-users o users es cero
            results.innerHTML = '<li class="list-group-item">No se encontraron usuarios</li>'; // msj "no se encontraron usuarios"
            return;
        }

        users.forEach(user => {
            const userItem = document.createElement('li');
            userItem.className = 'list-group-item bg-dark text-white';
            userItem.innerHTML = `
                <div>
                    <p>ID: ${user.id}</p>
                    <h5>Nombre: ${user.Name}</h5>
                    <h5>Apellido: ${user.LastName}</h5>
                </div>
            `;
            results.appendChild(userItem);
        });
    }

    // Función para mostrar una alerta de error
    function mostrarAlertaError() {
        const alertError = document.getElementById('alert-error');
        alertError.classList.add('show');
        setTimeout(() => {
            alertError.classList.remove('show');
        }, 3000);
    }

    // Inicializar la lista de usuarios al cargar la página
    listarUsuarios();

});


