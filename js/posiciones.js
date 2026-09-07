/**
 * ===================================================
 * Sistema de Tabla de Posiciones de Fútbol
 * Archivo: js/posiciones.js
 * Descripción: Cálculo y renderizado dinámico de la tabla de posiciones y métricas
 * ===================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  renderizarTablaPosiciones();
});

/**
 * Renderiza la tabla de posiciones con los datos calculados de LocalStorage
 */
function renderizarTablaPosiciones() {
  const tbody = document.getElementById('tabla-posiciones-body');
  if (!tbody) return;

  const posiciones = window.storageManager.calcularPosiciones();
  const totalEquipos = posiciones.length;

  // 1. Actualizar tarjetas de métricas en la parte superior
  actualizarMetricas(posiciones);

  // 2. Si no hay equipos registrados
  if (totalEquipos === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="10" class="text-center py-4 text-muted">
          <i class="bi bi-info-circle me-1"></i> No hay equipos registrados en el sistema. 
          Ve a la sección de <strong><a href="equipos.html">Equipos</a></strong> para comenzar.
        </td>
      </tr>
    `;
    return;
  }

  // 3. Renderizar cada fila según su posición en la tabla
  tbody.innerHTML = posiciones.map((eq, index) => {
    const pos = index + 1;

    // Determinar estilo de zona
    let rowClass = 'row-neutral';
    let badgeClass = 'pos-regular';
    let badgeTitle = 'Permanencia';

    if (pos === 1) {
      rowClass = 'row-champions';
      badgeClass = 'pos-gold';
      badgeTitle = 'Líder del Torneo';
    } else if (pos <= 4 && totalEquipos >= 4) {
      rowClass = 'row-champions';
      badgeClass = 'pos-champions';
      badgeTitle = 'Zona de Clasificación Internacional';
    } else if (totalEquipos > 4 && pos > totalEquipos - 2) {
      rowClass = 'row-relegation';
      badgeClass = 'pos-relegation';
      badgeTitle = 'Zona de Descenso';
    }

    // Formato de Diferencia de Goles
    let dgClass = 'dg-neutral';
    let dgTexto = `${eq.dg}`;
    if (eq.dg > 0) {
      dgClass = 'dg-positive';
      dgTexto = `+${eq.dg}`;
    } else if (eq.dg < 0) {
      dgClass = 'dg-negative';
    }

    // Logo / Escudo del club
    const logoHtml = eq.logo_url && eq.logo_url.startsWith('http')
      ? `<img src="${eq.logo_url}" alt="${eq.nombre}" style="width: 22px; height: 22px; object-fit: contain;">`
      : `<span>${eq.logo_url || '🛡️'}</span>`;

    return `
      <tr class="${rowClass}">
        <td>
          <span class="pos-badge ${badgeClass}" title="${badgeTitle}">${pos}</span>
        </td>
        <td class="col-team">
          <div class="team-item">
            <div class="team-shield">${logoHtml}</div>
            <span class="team-name">${eq.nombre}</span>
          </div>
        </td>
        <td>${eq.pj}</td>
        <td>${eq.pg}</td>
        <td>${eq.pe}</td>
        <td>${eq.pp}</td>
        <td>${eq.gf}</td>
        <td>${eq.gc}</td>
        <td class="${dgClass}">${dgTexto}</td>
        <td class="col-points">${eq.pts}</td>
      </tr>
    `;
  }).join('');
}

/**
 * Actualiza las estadísticas rápidas del encabezado
 */
function actualizarMetricas(posiciones) {
  const partidos = window.storageManager.getPartidos();
  const partidosJugados = partidos.filter(p => p.estado === 'finalizado');

  const totalGoles = partidosJugados.reduce((acc, p) => acc + Number(p.goles_local || 0) + Number(p.goles_visitante || 0), 0);
  const lider = posiciones.length > 0 ? posiciones[0].nombre : 'Sin definir';

  // Buscar elementos de métricas por contenido o selectores
  const metricCards = document.querySelectorAll('.stat-pill-card');
  if (metricCards.length >= 4) {
    // Equipos
    const valEquipos = metricCards[0].querySelector('.fs-5');
    if (valEquipos) valEquipos.textContent = `${posiciones.length} Clubes`;

    // Líder
    const valLider = metricCards[1].querySelector('.fs-6');
    if (valLider) valLider.textContent = lider;

    // Partidos jugados
    const valPartidos = metricCards[2].querySelector('.fs-5');
    if (valPartidos) valPartidos.textContent = `${partidosJugados.length} Jugados`;

    // Goles
    const valGoles = metricCards[3].querySelector('.fs-5');
    if (valGoles) valGoles.textContent = `${totalGoles} Goles`;
  }
}
