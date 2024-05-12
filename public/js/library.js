const token = localStorage.getItem('token');

// Si no hay token, redirigir al usuario a la página de inicio de sesión
if (!token) {
  window.location.href = `index.html?error=no_access&message=No tienes acceso a esta página. Por favor, inicia sesión o regístrate.`;
}

const tableBody = document.querySelector('#book-table tbody');
const registrationForm = document.getElementById('registration-form');
const bookIdInput = document.getElementById('bookId');

// Función para cargar los datos del libro en el formulario de registro
function loadBookDataForEdit(bookId) {
  fetch(`/api/books/getBy?_id=${bookId}`)
    .then(response => response.json())
    .then(data => {
      const book = data.book;
      document.getElementById('bookname').value = book.bookname;
      document.getElementById('author').value = book.author;
      document.getElementById('date').value = book.date;
      document.getElementById('status').value = book.status;
      bookIdInput.value = book._id; 
    })
    .catch(error => {
      console.error('Error al obtener el libro:', error);
      alert('Error al obtener el libro');
    });
}

// Cargar la lista de libros al cargar la página
fetch('/api/books/getAll')
  .then(response => response.json())
  .then(data => {
    renderBooks(data.books); // Renderizar todos los libros al cargar la página

    // Agregar un manejador de eventos para el botón "Editar" en cada fila
    tableBody.addEventListener('click', event => {
      if (event.target.classList.contains('edit-button')) {
        const bookId = event.target.getAttribute('data-book-id');
        loadBookDataForEdit(bookId);
      }
      // Agregar un manejador de eventos para el botón "Eliminar" en cada fila
      if (event.target.classList.contains('delete-button')) {
        const bookId = event.target.getAttribute('data-book-id');
        deleteBook(bookId);
      }
    });
  })
  .catch(error => {
    console.error('Error al obtener los libros:', error);
    alert('Error al obtener los libros');
  });

// Función para eliminar un libro
async function deleteBook(bookId) {
  try {
    const response = await fetch(`/api/books/delete?_id=${bookId}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      alert('Libro eliminado correctamente');
      // Actualizar la tabla después de eliminar el libro
      location.reload();
    } else {
      const errorMessage = await response.text();
      alert('Error al eliminar el libro: ' + errorMessage);
    }
  } catch (error) {
    console.error('Error al enviar la solicitud de eliminación:', error);
    alert('Error al eliminar el libro');
  }
}

// Manejar el envío del formulario de registro (para guardar o editar un libro)
registrationForm.addEventListener('submit', async function(event) {
  event.preventDefault();
  
  const bookId = bookIdInput.value; // Obtener el ID del libro (si existe)
  const bookname = document.getElementById('bookname').value;
  const author = document.getElementById('author').value;
  const date = document.getElementById('date').value;
  const status = document.getElementById('status').value;

  try {
    let url = '/api/books/update';
    let method = 'PUT';
    let successMessage = 'Libro guardado correctamente';

    // Verificar si hay un ID de libro
    if (!bookId) {
      url = '/api/books'; // Cambiar la URL a la de creación si no hay ID
      method = 'POST'; // Cambiar el método HTTP a POST
      successMessage = 'Libro creado correctamente';
    } else {
      url += `?_id=${bookId}`; // Agregar el ID del libro a la URL de actualización
      successMessage = 'Libro actualizado correctamente';
    }

    const response = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ bookname, author, date, status })
    });

    if (response.ok) {
      alert(successMessage);
      location.reload();
    } else {
      const errorMessage = await response.text();
      alert('Error al guardar el libro: ' + errorMessage);
    }
  } catch (error) {
    console.error('Error al enviar la solicitud:', error);
    alert('Error al guardar el libro');
  }
});

// Definir una función para realizar la búsqueda de libros
async function searchBooks(query) {
  try {
    const response = await fetch(`/api/books/search?query=${query}`);
    if (response.ok) {
      const data = await response.json();
      return data.books; // Devolver los libros encontrados
    } else {
      const errorMessage = await response.text();
      throw new Error(errorMessage);
    }
  } catch (error) {
    console.error('Error al buscar libros:', error);
    throw error;
  }
}

// Función para renderizar la tabla de libros
function renderBooks(books) {
  const tableBody = document.querySelector('#book-table tbody');
  // Limpiar el contenido anterior de la tabla
  tableBody.innerHTML = '';
  // Renderizar cada libro en la tabla
  books.forEach(book => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${book.bookname}</td>
      <td>${book.author}</td>
      <td>${book.date}</td>
      <td>${book.status}</td>
      <td>
        <button class="edit-button" data-book-id="${book._id}">Editar</button>
        <button class="delete-button" data-book-id="${book._id}">Eliminar</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

// Manejar el evento de envío del formulario de búsqueda
const searchForm = document.getElementById('search-form');
searchForm.addEventListener('submit', async function(event) {
  event.preventDefault();
  const query = document.getElementById('search-input').value;
  try {
    const books = await searchBooks(query);
    renderBooks(books);
  } catch (error) {
    alert('Error al buscar libros. Por favor, inténtalo de nuevo.');
  }

// Función para cargar todos los libros al cargar la página
function loadAllBooks() {
  fetch('/api/books/getAll')
    .then(response => response.json())
    .then(data => {
      renderBooks(data.books); // Renderizar todos los libros
    })
    .catch(error => {
      console.error('Error al obtener los libros:', error);
      alert('Error al obtener los libros');
    });
}

// Agregar un botón de "Limpiar filtro"
const clearFilterButton = document.getElementById('clear-filter-button');

// Manejar el clic en el botón de "Limpiar filtro"
clearFilterButton.addEventListener('click', function() {
  document.getElementById('search-input').value = ''; // Limpiar el campo de búsqueda
  loadAllBooks(); // Cargar todos los libros nuevamente
});

});
