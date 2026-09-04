/**
 * ===================================================
 * Sistema de Tabla de Posiciones de Fútbol
 * Archivo: js/partidos.js
 * Descripción: Registro y gestión de partidos y resultados.
 * ===================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  console.log('Módulo de Partidos y Resultados inicializado.');

  // En las siguientes etapas aquí se cargarán los selectores de equipos,
  // el guardado de partidos y la lista de encuentros registrados con Supabase.
  inicializarPartidos();
});

/**
 * Inicializa la vista de partidos (placeholder inicial)
 */
function inicializarPartidos() {
  const tbody = document.getElementById('lista-partidos-body');
  if (!tbody) return;

  tbody.innerHTML = `
    <tr>
      <td colspan="6" class="text-center py-4 text-muted">
        <i class="bi bi-info-circle me-2"></i>
        No hay partidos registrados aún. La funcionalidad se conectará en las siguientes etapas.
      </td>
    </tr>
  `;
}
