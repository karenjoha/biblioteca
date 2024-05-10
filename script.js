// script.js

const loginForm = document.getElementById('loginForm');
const message = document.getElementById('message');

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const username = loginForm.username.value;
  const password = loginForm.password.value;

  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    if (!response.ok) {
      throw new Error('Credenciales inválidas');
    }

    const data = await response.json();
    localStorage.setItem('accessToken', data.accessToken);
    window.location.href = '/dashboard.html'; // Redirigir al dashboard después del inicio de sesión
  } catch (error) {
    message.textContent = error.message;
  }
});
