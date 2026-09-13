/**
 * ===================================================
 * Sistema de Tabla de Posiciones de Fútbol
 * Archivo: js/posiciones.js
 * Descripción: Cálculo y renderizado dinámico de la tabla de posiciones y métricas
 * ===================================================
 */

document.addEventListener('DOMContentLoaded', async () => {
  await renderizarTablaPosiciones();
});

/**
 * Renderiza la tabla de posiciones con los datos calculados de la API
 */
async function renderizarTablaPosiciones() {
  const tbody = document.getElementById('tabla-posiciones-body');
  if (!tbody) return;

  try {
    const posiciones = await window.api.posiciones.calcular();
    const totalEquipos = posiciones.length;

    // 1. Actualizar tarjetas de métricas en la parte superior
    await actualizarMetricas(posiciones);

    // 2. Si no hay equipos registrados
    if (totalEquipos === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="10" class="text-center py-4 text-muted">
            <i class="bi bi-info-circle me-1"></i> No hay equipos registrados en el sistema. 
            El administrador debe registrar clubes en el panel de control.
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

      // Generar badges de racha (últimos 5 partidos)
      const rachaBadges = (eq.racha && eq.racha.length > 0)
        ? eq.racha.map(r => {
            const cls = r.resultado === 'V' ? 'forma-v' : (r.resultado === 'E' ? 'forma-e' : 'forma-d');
            return `<span class="forma-badge ${cls}" title="${r.detalle || r.resultado}">${r.resultado}</span>`;
          }).join('')
        : '<span class="text-muted small">-</span>';

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
          <td class="text-center">
            <div class="forma-container">${rachaBadges}</div>
          </td>
        </tr>
      `;
    }).join('');
  } catch (err) {
    console.error('Error al renderizar tabla de posiciones:', err);
  }
}

/**
 * Actualiza las estadísticas rápidas del encabezado
 */
async function actualizarMetricas(posiciones) {
  try {
    const partidos = await window.api.partidos.getAll();
    const partidosJugados = partidos.filter(p => p.estado === 'finalizado');

    const totalGoles = partidosJugados.reduce((acc, p) => acc + Number(p.goles_local || 0) + Number(p.goles_visitante || 0), 0);
    const lider = posiciones.length > 0 ? posiciones[0].nombre : 'Sin definir';

    const metricCards = document.querySelectorAll('.stat-pill-card');
    if (metricCards.length >= 4) {
      const valEquipos = metricCards[0].querySelector('.fs-5');
      if (valEquipos) valEquipos.textContent = `${posiciones.length} Clubes`;

      const valLider = metricCards[1].querySelector('.fs-6');
      if (valLider) valLider.textContent = lider;

      const valPartidos = metricCards[2].querySelector('.fs-5');
      if (valPartidos) valPartidos.textContent = `${partidosJugados.length} Jugados`;

      const valGoles = metricCards[3].querySelector('.fs-5');
      if (valGoles) valGoles.textContent = `${totalGoles} Goles`;
    }
  } catch (err) {
    console.error('Error al actualizar métricas:', err);
  }
}
