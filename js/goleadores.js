/**
 * ===================================================
 * Sistema de Tabla de Posiciones de Fútbol
 * Archivo: js/goleadores.js
 * Descripción: Vista Pública de la Tabla de Goleadores y Destaque del Pichichi
 * ===================================================
 */

document.addEventListener('DOMContentLoaded', async () => {
  await renderizarGoleadoresPublicos();
});

async function renderizarGoleadoresPublicos() {
  const heroCardCont = document.getElementById('contenedor-pichichi-hero');
  const tbody = document.getElementById('tabla-goleadores-body');
  const totalGoleadoresBadge = document.getElementById('contador-goleadores-publicos');

  try {
    const goleadores = await window.api.goles.getTablaGoleadores();

    if (totalGoleadoresBadge) {
      const conGoles = goleadores.filter(g => g.goles > 0);
      totalGoleadoresBadge.textContent = `${conGoles.length} Anotadores`;
    }

    // 1. Renderizar Tarjeta Hero del Pichichi (Máximo Goleador)
    const pichichi = goleadores.length > 0 && goleadores[0].goles > 0 ? goleadores[0] : null;

    if (heroCardCont) {
      if (pichichi) {
        const fotoPichichi = pichichi.foto_url && pichichi.foto_url.startsWith('http')
          ? `<img src="${pichichi.foto_url}" alt="${pichichi.nombre}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`
          : `<span>${pichichi.foto_url || '👑'}</span>`;

        heroCardCont.innerHTML = `
          <div class="card pichichi-hero-card p-4 p-md-5 mb-4">
            <div class="row align-items-center g-4">
              <div class="col-auto">
                <div class="pichichi-avatar-box">
                  ${fotoPichichi}
                </div>
              </div>
              <div class="col">
                <div class="d-flex align-items-center gap-2 mb-1 flex-wrap">
                  <span class="badge bg-warning text-dark fw-bold px-3 py-1 text-uppercase">
                    <i class="bi bi-trophy-fill me-1"></i> Líder de Goleo / Pichichi
                  </span>
                  <span class="badge bg-dark text-white fw-bold px-2 py-1">#${pichichi.numero}</span>
                </div>
                <h2 class="display-6 fw-bold text-dark mb-1">${pichichi.nombre}</h2>
                <div class="d-flex align-items-center gap-3 text-muted flex-wrap">
                  <div class="d-flex align-items-center gap-2">
                    <span>${pichichi.equipo_logo && pichichi.equipo_logo.startsWith('http') ? `<img src="${pichichi.equipo_logo}" style="width: 22px; height: 22px;">` : (pichichi.equipo_logo || '🛡️')}</span>
                    <strong class="text-dark">${pichichi.equipo_nombre}</strong>
                  </div>
                  <span>•</span>
                  <span><i class="bi bi-person-badge me-1"></i>${pichichi.posicion}</span>
                  <span>•</span>
                  <span><i class="bi bi-speedometer2 me-1"></i>${pichichi.promedio} goles/partido</span>
                </div>
              </div>
              <div class="col-12 col-md-auto text-md-end">
                <div class="pichichi-goals-badge">
                  <div class="fs-1 fw-bold lh-1">${pichichi.goles}</div>
                  <div class="small fw-semibold text-uppercase tracking-wider">Goles Anotados</div>
                </div>
              </div>
            </div>
          </div>
        `;
      } else {
        heroCardCont.innerHTML = `
          <div class="card card-custom p-4 text-center text-muted mb-4 border">
            <i class="bi bi-trophy fs-1 text-secondary mb-2"></i>
            <h4 class="fw-bold">Aún no hay goleadores registrados</h4>
            <p class="mb-0">A medida que el administrador registre los marcadores de los partidos, aquí se destacará al Pichichi del torneo.</p>
          </div>
        `;
      }
    }

    // 2. Renderizar Tabla General de Goleadores
    if (tbody) {
      if (goleadores.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="7" class="text-center py-4 text-muted">
              <i class="bi bi-info-circle me-1"></i> No hay jugadores registrados en el torneo.
            </td>
          </tr>
        `;
        return;
      }

      tbody.innerHTML = goleadores.map((j, index) => {
        const rank = index + 1;

        // Medallas para el podio
        let rankBadge = `<span class="fw-bold text-muted">#${rank}</span>`;
        if (rank === 1 && j.goles > 0) rankBadge = `<span class="medal-badge medal-gold" title="1º Lugar">🥇</span>`;
        else if (rank === 2 && j.goles > 0) rankBadge = `<span class="medal-badge medal-silver" title="2º Lugar">🥈</span>`;
        else if (rank === 3 && j.goles > 0) rankBadge = `<span class="medal-badge medal-bronze" title="3º Lugar">🥉</span>`;

        const fotoHtml = j.foto_url && j.foto_url.startsWith('http')
          ? `<img src="${j.foto_url}" alt="${j.nombre}" style="width: 28px; height: 28px; object-fit: cover; border-radius: 50%;">`
          : `<span>${j.foto_url || '⚽'}</span>`;

        const eqLogo = j.equipo_logo && j.equipo_logo.startsWith('http')
          ? `<img src="${j.equipo_logo}" style="width: 20px; height: 20px;">`
          : (j.equipo_logo || '🛡️');

        return `
          <tr class="${rank === 1 && j.goles > 0 ? 'table-warning-subtle' : ''}">
            <td class="text-center">${rankBadge}</td>
            <td>
              <div class="d-flex align-items-center gap-2">
                <div class="team-shield" style="width: 32px; height: 32px;">${fotoHtml}</div>
                <div>
                  <span class="fw-bold text-dark">${j.nombre}</span>
                  <span class="badge bg-light text-muted border ms-1">#${j.numero}</span>
                </div>
              </div>
            </td>
            <td>
              <div class="d-flex align-items-center gap-2">
                <span>${eqLogo}</span>
                <span class="fw-semibold">${j.equipo_nombre}</span>
              </div>
            </td>
            <td class="text-center">
              <span class="badge bg-light text-dark border px-2 py-1">${j.posicion}</span>
            </td>
            <td class="text-center text-muted">${j.partidos_jugados}</td>
            <td class="text-center text-muted fw-semibold">${j.promedio}</td>
            <td class="text-center">
              <span class="badge ${j.goles > 0 ? 'bg-primary fs-6 px-3 py-1' : 'bg-light text-muted border'}">
                ${j.goles}
              </span>
            </td>
          </tr>
        `;
      }).join('');
    }
  } catch (err) {
    console.error('Error al renderizar goleadores:', err);
  }
}
