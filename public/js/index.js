document.getElementById('loginForm').addEventListener('submit', async function(event) {
  event.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    if (response.ok) {
      const data = await response.json();
      const token = data.token;
      localStorage.setItem('token', token); // Almacenar el token JWT en el almacenamiento local
      window.location.href = 'library.html';
    } else {
      const errorMessage = await response.text();
      document.getElementById('message').textContent = 'Error: ' + errorMessage;
    }
  } catch (error) {
    console.error('Error al enviar la solicitud:', error);
    document.getElementById('message').textContent = 'Error al iniciar sesión';
  }
});
