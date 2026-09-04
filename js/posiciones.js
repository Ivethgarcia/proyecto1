/**
 * ===================================================
 * Sistema de Tabla de Posiciones de Fútbol
 * Archivo: js/posiciones.js
 * Descripción: Manejo de la tabla de posiciones y cálculos.
 * ===================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  console.log('Módulo de Tabla de Posiciones inicializado.');
  
  // En las siguientes etapas aquí se conectará con Supabase
  // para obtener equipos y partidos, calcular estadísticas y renderizar la tabla.
  inicializarTablaPosiciones();
});

/**
 * Inicializa la tabla de posiciones (placeholder inicial)
 */
function inicializarTablaPosiciones() {
  const tbody = document.getElementById('tabla-posiciones-body');
  if (!tbody) return;

  // Mensaje temporal inicial
  tbody.innerHTML = `
    <tr>
      <td colspan="10" class="text-center py-4 text-muted">
        <i class="bi bi-info-circle me-2"></i>
        Estructura inicial lista. Conéctate a Supabase y registra equipos/partidos para ver la tabla.
      </td>
    </tr>
  `;
}
