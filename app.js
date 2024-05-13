// Función para cargar la lista de usuarios desde la API
function loadUsers() {
  fetch("https://jsonplaceholder.typicode.com/users")
    .then((response) => response.json())
    .then((users) => {
      // Guarda la lista de usuarios para usarla en la búsqueda
      window.allUsers = users;

      // Muestra todos los usuarios al principio
      renderUsers(users);
    });
}

// Función para renderizar la lista de usuarios
function renderUsers(users) {
  const appElement = document.getElementById("app");
  appElement.innerHTML = "<h1>Users:</h1>";

  users.forEach((user) => {
    const userCard = createUserCard(user);
    appElement.appendChild(userCard);
  });
}

// Función para crear una tarjeta de usuario
function createUserCard(user) {
  const userCard = document.createElement("div");
  userCard.classList.add("user-card");
  userCard.textContent = user.name;

  userCard.addEventListener("click", () => {
    toggleUserDetails(userCard, user);
  });

  return userCard;
}

// Función para alternar la visualización de los detalles del usuario
function toggleUserDetails(userCard, user) {
  if (!userCard.classList.contains("expanded")) {
    userCard.classList.add("expanded");
    userCard.appendChild(createUserDetails(user));
  } else {
    userCard.classList.remove("expanded");
    const userDetails = userCard.querySelector(".user-details");
    if (userDetails) {
      userDetails.remove();
    }
  }
}

// Función para crear los detalles de un usuario
function createUserDetails(user) {
  const userDetails = document.createElement("div");
  userDetails.classList.add("user-details");
  userDetails.innerHTML = `
      <p>Email: ${user.email}</p>
      <p>Phone: ${user.phone}</p>
      <p>Website: ${user.website}</p>
    `;
  return userDetails;
}

// Función para manejar la búsqueda de usuarios por nombre
function searchUsersByName() {
  const searchTerm = document
    .getElementById("searchInput")
    .value.trim()
    .toLowerCase();
  const filteredUsers = window.allUsers.filter((user) =>
    user.name.toLowerCase().includes(searchTerm)
  );

  // Si no se encuentran usuarios, mostrar un mensaje
  if (filteredUsers.length === 0) {
    document.getElementById("app").innerHTML =
      "<p>No se encontraron usuarios con ese nombre.</p>";
  } else {
    // Si se encuentran usuarios, renderizarlos
    renderUsers(filteredUsers);
  }

  // Agregar un botón "Ver Todos" siempre
  const appElement = document.getElementById("app");
  const verTodosButton = createVerTodosButton();

  // Insertar el botón "Ver Todos" después de los usuarios (o el mensaje si no se encontraron usuarios)
  appElement.appendChild(verTodosButton);
}

// Función para crear el botón "Ver Todos"
function createVerTodosButton() {
  const verTodosButton = document.createElement("button");
  verTodosButton.textContent = "Ver Todos";

  verTodosButton.addEventListener("click", () => {
    // Mostrar todos los usuarios nuevamente
    renderUsers(window.allUsers);
    // Borrar el contenido del campo de búsqueda
    document.getElementById("searchInput").value = "";
  });

  return verTodosButton;
}

// Escuchar el evento de envío del formulario de búsqueda
document
  .getElementById("searchForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Evita que el formulario se envíe
    searchUsersByName(); // Ejecuta la búsqueda de usuarios
  });

// Función para manejar cambios en la ruta
function router() {
  const path = window.location.hash.substring(1);
  if (path === "" || path === "users") {
    loadUsers();
  } else if (path.startsWith("user/")) {
    const userId = path.split("/")[1];
    loadUserDetails(userId);
  } else {
    // Ruta no encontrada
    loadView("404");
  }
}

// Escuchar cambios en la URL
window.addEventListener("hashchange", router);

// Cargar la vista inicial
router();
