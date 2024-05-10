// dashboard.js

window.onload = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('Usuario no autenticado');
      }
  
      const response = await fetch('/api/books', {
        headers: {
          Authorization: accessToken
        }
      });
  
      if (!response.ok) {
        throw new Error('Error al obtener la lista de libros');
      }
  
      const books = await response.json();
      const booksList = document.getElementById('booksList');
      books.forEach(book => {
        const bookElement = document.createElement('div');
        bookElement.textContent = `${book.title} - ${book.author} (${book.year}) - Estado: ${book.status}`;
        booksList.appendChild(bookElement);
      });
    } catch (error) {
      alert(error.message);
      window.location.href = '/index.html'; // Redirigir al inicio de sesión si no se pudo obtener la lista de libros
    }
  };
  