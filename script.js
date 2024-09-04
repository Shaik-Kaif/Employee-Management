document.querySelector('#btn').addEventListener('click', function() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  if (username.length > 3 && password.length >= 4) {
      localStorage.setItem('username', username);
      window.location.replace('dashboard-index.html');
  } else {
      alert('Username should be more than 3 characters and password should contain at least 4 characters');
  }
});



