/**
 * ===================================================
 * Sistema de Tabla de Posiciones de Fútbol
 * Archivo: js/calendario.js
 * Descripción: Vista Pública de Partidos y Resultados (Solo Lectura)
 * ===================================================
 */

document.addEventListener('DOMContentLoaded', async () => {
  await inicializarCalendarioPublico();
});

let todosLosPartidos = [];
let todosLosEquipos = [];

async function inicializarCalendarioPublico() {
  try {
    todosLosEquipos = await window.api.equipos.getAll();
    todosLosPartidos = await window.api.partidos.getAll();

    configurarFiltros();
    renderizarPartidosPublicos(todosLosPartidos);
  } catch (err) {
    console.error('Error al cargar calendario público:', err);
  }
}

/**
 * Configura los selectores de filtrado por jornada y estado
 */
function configurarFiltros() {
  const selectJornada = document.getElementById('filtro-jornada');
  const selectEstado = document.getElementById('filtro-estado');

  if (!selectJornada) return;

  // Obtener jornadas únicas
  const jornadas = [...new Set(todosLosPartidos.map(p => p.jornada))].sort((a, b) => a - b);
  
  selectJornada.innerHTML = `<option value="todas">Todas las Jornadas</option>` +
    jornadas.map(j => `<option value="${j}">Jornada ${j}</option>`).join('');

  const aplicarFiltro = () => {
    const jornadaSeleccionada = selectJornada.value;
    const estadoSeleccionado = selectEstado ? selectEstado.value : 'todos';

    let filtrados = [...todosLosPartidos];

    if (jornadaSeleccionada !== 'todas') {
      filtrados = filtrados.filter(p => String(p.jornada) === String(jornadaSeleccionada));
    }

    if (estadoSeleccionado !== 'todos') {
      filtrados = filtrados.filter(p => p.estado === estadoSeleccionado);
    }

    renderizarPartidosPublicos(filtrados);
  };

  selectJornada.addEventListener('change', aplicarFiltro);
  if (selectEstado) {
    selectEstado.addEventListener('change', aplicarFiltro);
  }
}

/**
 * Renderiza los partidos en modo de solo lectura
 */
function renderizarPartidosPublicos(partidos) {
  const contenedor = document.getElementById('contenedor-partidos-publicos');
  if (!contenedor) return;

  if (partidos.length === 0) {
    contenedor.innerHTML = `
      <div class="col-12 text-center py-5">
        <div class="p-4 bg-white rounded-3 border text-muted shadow-sm">
          <i class="bi bi-calendar-x fs-1 text-secondary mb-2 d-block"></i>
          <h5 class="fw-bold">No hay encuentros disponibles</h5>
          <p class="mb-0">No se encontraron partidos para los filtros seleccionados.</p>
        </div>
      </div>
    `;
    return;
  }

  // Ordenar por jornada ascendente o fecha
  const ordenados = [...partidos].sort((a, b) => {
    if (a.jornada !== b.jornada) return a.jornada - b.jornada;
    return new Date(a.fecha) - new Date(b.fecha);
  });

  const getEquipo = (id) => todosLosEquipos.find(e => String(e.id) === String(id)) || { nombre: 'Equipo', logo_url: '🛡️' };

  contenedor.innerHTML = ordenados.map(p => {
    const locId = p.local_id || p.equipo_local_id;
    const visId = p.visitante_id || p.equipo_visitante_id;
    const local = getEquipo(locId);
    const visitante = getEquipo(visId);

    const esFinalizado = p.estado === 'finalizado';
    const estadoBadge = esFinalizado
      ? `<span class="badge bg-success-subtle text-success border border-success-subtle px-2 py-1"><i class="bi bi-check-circle-fill me-1"></i>Finalizado</span>`
      : `<span class="badge bg-warning-subtle text-warning border border-warning-subtle px-2 py-1"><i class="bi bi-clock-fill me-1"></i>Próximamente</span>`;

    const fechaFormateada = p.fecha ? new Date(p.fecha + 'T00:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Fecha por definir';

    // Logo o icono
    const logoLocal = local.logo_url && local.logo_url.startsWith('http')
      ? `<img src="${local.logo_url}" alt="${local.nombre}" style="width: 32px; height: 32px; object-fit: contain;">`
      : `<span style="font-size: 1.5rem;">${local.logo_url || '🛡️'}</span>`;

    const logoVisitante = visitante.logo_url && visitante.logo_url.startsWith('http')
      ? `<img src="${visitante.logo_url}" alt="${visitante.nombre}" style="width: 32px; height: 32px; object-fit: contain;">`
      : `<span style="font-size: 1.5rem;">${visitante.logo_url || '🛡️'}</span>`;

    return `
      <div class="col-md-6 col-lg-6 mb-3">
        <div class="card card-custom h-100 border p-3">
          <!-- Cabecera de la tarjeta: Jornada, Fecha y Estado -->
          <div class="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
            <div>
              <span class="badge bg-primary me-2">Jornada ${p.jornada}</span>
              <small class="text-muted"><i class="bi bi-calendar3 me-1"></i>${fechaFormateada}</small>
            </div>
            <div>
              ${estadoBadge}
            </div>
          </div>

          <!-- Encuentro: Local vs Visitante -->
          <div class="row align-items-center py-2 text-center g-2">
            <!-- Equipo Local -->
            <div class="col-5 text-end pe-2">
              <div class="d-flex align-items-center justify-content-end gap-2">
                <span class="fw-bold text-dark text-truncate" style="max-width: 140px;">${local.nombre}</span>
                <div class="team-shield flex-shrink-0">${logoLocal}</div>
              </div>
            </div>

            <!-- Marcador central -->
            <div class="col-2 px-0">
              ${esFinalizado ? `
                <div class="badge bg-dark fs-5 px-3 py-2 text-white">
                  ${p.goles_local} - ${p.goles_visitante}
                </div>
              ` : `
                <div class="badge bg-light text-muted border px-2 py-1">
                  VS
                </div>
              `}
            </div>

            <!-- Equipo Visitante -->
            <div class="col-5 text-start ps-2">
              <div class="d-flex align-items-center justify-content-start gap-2">
                <div class="team-shield flex-shrink-0">${logoVisitante}</div>
                <span class="fw-bold text-dark text-truncate" style="max-width: 140px;">${visitante.nombre}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    `;
  }).join('');
}
