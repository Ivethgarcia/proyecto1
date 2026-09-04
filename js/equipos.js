/**
 * ===================================================
 * Sistema de Tabla de Posiciones de Fútbol
 * Archivo: js/equipos.js
 * Descripción: Gestión y administración de equipos.
 * ===================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  console.log('Módulo de Administración de Equipos inicializado.');

  // En las siguientes etapas aquí se gestionará el formulario de registro,
  // la lista de equipos y la persistencia con Supabase.
  inicializarEquipos();
});

/**
 * Inicializa la vista de administración de equipos (placeholder inicial)
 */
function inicializarEquipos() {
  const tbody = document.getElementById('lista-equipos-body');
  if (!tbody) return;

  tbody.innerHTML = `
    <tr>
      <td colspan="5" class="text-center py-4 text-muted">
        <i class="bi bi-info-circle me-2"></i>
        No hay equipos registrados aún. La funcionalidad se conectará en las siguientes etapas.
      </td>
    </tr>
  `;
}
