/**
 * ===================================================
 * Sistema de Tabla de Posiciones de Fútbol
 * Archivo: js/equipos.js
 * Descripción: Gestión completa de Equipos con LocalStorage
 * ===================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  renderizarEquipos();
  configurarFormulario();
});

/**
 * Renderiza la lista de equipos en la tabla HTML
 */
function renderizarEquipos() {
  const tbody = document.getElementById('lista-equipos-body');
  if (!tbody) return;

  const equipos = window.storageManager.getEquipos();

  if (equipos.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="4" class="text-center py-4 text-muted">
          <i class="bi bi-info-circle me-1"></i> No hay equipos registrados. Agrega uno usando el formulario.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = equipos.map((eq, index) => {
    // Si logo_url es una URL web mostramos <img>, de lo contrario texto/emoji
    const logoHtml = eq.logo_url && eq.logo_url.startsWith('http')
      ? `<img src="${eq.logo_url}" alt="${eq.nombre}" style="width: 28px; height: 28px; object-fit: contain;">`
      : `<span style="font-size: 1.2rem;">${eq.logo_url || '🛡️'}</span>`;

    return `
      <tr>
        <td class="fw-bold text-muted">${index + 1}</td>
        <td>
          <div class="team-shield">
            ${logoHtml}
          </div>
        </td>
        <td class="fw-semibold">${eq.nombre}</td>
        <td class="text-center">
          <button class="btn btn-outline-danger btn-sm" onclick="eliminarEquipo(${eq.id}, '${eq.nombre}')" title="Eliminar equipo">
            <i class="bi bi-trash"></i> Eliminar
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

/**
 * Configura el formulario para agregar un nuevo equipo
 */
function configurarFormulario() {
  const form = document.getElementById('form-equipo');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nombreInput = document.getElementById('nombre-equipo');
    const logoInput = document.getElementById('logo-equipo');

    const nombre = nombreInput.value.trim();
    const logo = logoInput.value.trim();

    if (!nombre) {
      alert('Por favor ingresa el nombre del equipo.');
      return;
    }

    try {
      window.storageManager.addEquipo(nombre, logo);
      form.reset();
      renderizarEquipos();

      // Feedback visual
      nombreInput.focus();
    } catch (error) {
      alert(error.message);
    }
  });
}

/**
 * Elimina un equipo con confirmación
 */
window.eliminarEquipo = function(id, nombre) {
  if (confirm(`¿Estás seguro de eliminar el equipo "${nombre}"? También se eliminarán sus partidos relacionados.`)) {
    window.storageManager.deleteEquipo(id);
    renderizarEquipos();
  }
};
