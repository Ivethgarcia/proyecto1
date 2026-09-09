/**
 * ===================================================
 * Sistema de Tabla de Posiciones de Fútbol
 * Archivo: js/auth.js
 * Descripción: Manejo de autenticación, sesiones y protección de rutas administrativas
 * ===================================================
 */

document.addEventListener('DOMContentLoaded', async () => {
  // Verificar si la página actual es una ruta administrativa
  const esRutaAdmin = window.location.pathname.includes('admin-');
  
  if (esRutaAdmin) {
    await protegerRutaAdmin();
  }

  // Configurar botones de cerrar sesión si existen en el DOM
  configurarBotonLogout();
});

/**
 * Protege las páginas administrativas. Si no hay sesión activa, redirige a login.html
 */
async function protegerRutaAdmin() {
  try {
    const usuario = await window.api.auth.getUser();
    if (!usuario) {
      console.warn('Acceso denegado: Se requiere autenticación para el Panel de Administrador.');
      window.location.href = 'login.html';
      return;
    }

    // Mostrar el correo del administrador en la barra de navegación si existe el elemento
    const adminUserBadge = document.getElementById('admin-user-email');
    if (adminUserBadge) {
      adminUserBadge.textContent = usuario.email || 'Administrador';
    }
  } catch (err) {
    console.error('Error al verificar sesión:', err);
    window.location.href = 'login.html';
  }
}

/**
 * Configura el evento para el botón de cerrar sesión
 */
function configurarBotonLogout() {
  const btnLogout = document.getElementById('btn-logout');
  if (!btnLogout) return;

  btnLogout.addEventListener('click', async (e) => {
    e.preventDefault();
    if (confirm('¿Deseas cerrar la sesión del Panel de Administrador?')) {
      try {
        await window.api.auth.logout();
        window.location.href = 'login.html';
      } catch (err) {
        console.error('Error al cerrar sesión:', err);
        window.location.href = 'login.html';
      }
    }
  });
}
