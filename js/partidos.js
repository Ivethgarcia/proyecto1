/**
 * ===================================================
 * Sistema de Tabla de Posiciones de Fútbol
 * Archivo: js/partidos.js
 * Descripción: Registro y gestión de partidos y resultados con LocalStorage
 * ===================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  cargarSelectsEquipos();
  renderizarPartidos();
  configurarFormularioPartido();
});

/**
 * Llena los selectores de equipo local y visitante
 */
function cargarSelectsEquipos() {
  const selectLocal = document.getElementById('equipo-local');
  const selectVisitante = document.getElementById('equipo-visitante');
  if (!selectLocal || !selectVisitante) return;

  const equipos = window.storageManager.getEquipos();

  const opciones = equipos.map(eq => `<option value="${eq.id}">${eq.nombre}</option>`).join('');

  selectLocal.innerHTML = `<option value="" selected disabled>Selecciona equipo local...</option>` + opciones;
  selectVisitante.innerHTML = `<option value="" selected disabled>Selecciona equipo visitante...</option>` + opciones;
}

/**
 * Renderiza la lista de partidos registrados
 */
function renderizarPartidos() {
  const tbody = document.getElementById('lista-partidos-body');
  if (!tbody) return;

  const partidos = window.storageManager.getPartidos();

  if (partidos.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="text-center py-4 text-muted">
          <i class="bi bi-info-circle me-1"></i> No hay partidos registrados aún. Registra uno con el formulario.
        </td>
      </tr>
    `;
    return;
  }

  // Ordenar por jornada descendente
  const partidosOrdenados = [...partidos].sort((a, b) => b.jornada - a.jornada);

  tbody.innerHTML = partidosOrdenados.map(p => {
    const local = window.storageManager.getEquipoById(p.local_id) || { nombre: 'Equipo eliminado', logo_url: '❓' };
    const visitante = window.storageManager.getEquipoById(p.visitante_id) || { nombre: 'Equipo eliminado', logo_url: '❓' };

    const esFinalizado = p.estado === 'finalizado';
    const marcador = esFinalizado ? `<strong>${p.goles_local} - ${p.goles_visitante}</strong>` : `<span class="text-muted">vs</span>`;
    const estadoBadge = esFinalizado 
      ? `<span class="badge bg-success-subtle text-success border border-success-subtle">Finalizado</span>` 
      : `<span class="badge bg-warning-subtle text-warning border border-warning-subtle">Pendiente</span>`;

    return `
      <tr>
        <td class="fw-bold text-muted text-center">${p.jornada}</td>
        <td>
          <div class="d-flex align-items-center gap-2">
            <span>${local.logo_url}</span>
            <span class="fw-semibold">${local.nombre}</span>
          </div>
        </td>
        <td class="text-center">${marcador}</td>
        <td>
          <div class="d-flex align-items-center gap-2">
            <span>${visitante.logo_url}</span>
            <span class="fw-semibold">${visitante.nombre}</span>
          </div>
        </td>
        <td class="text-center">${estadoBadge}</td>
        <td class="text-center">
          <button class="btn btn-outline-danger btn-sm" onclick="eliminarPartido(${p.id})" title="Eliminar encuentro">
            <i class="bi bi-trash"></i>
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

/**
 * Configura el formulario de captura de partidos
 */
function configurarFormularioPartido() {
  const form = document.getElementById('form-partido');
  if (!form) return;

  // Asignar fecha de hoy por defecto
  const fechaInput = document.getElementById('fecha-partido');
  if (fechaInput && !fechaInput.value) {
    fechaInput.value = new Date().toISOString().split('T')[0];
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const jornada = document.getElementById('jornada').value;
    const fecha = document.getElementById('fecha-partido').value;
    const local_id = document.getElementById('equipo-local').value;
    const visitante_id = document.getElementById('equipo-visitante').value;
    const goles_local = document.getElementById('goles-local').value;
    const goles_visitante = document.getElementById('goles-visitante').value;
    const estado = document.getElementById('estado-partido').value;

    if (!local_id || !visitante_id) {
      alert('Debes seleccionar tanto el equipo local como el visitante.');
      return;
    }

    try {
      window.storageManager.addPartido({
        jornada,
        fecha,
        local_id,
        visitante_id,
        goles_local,
        goles_visitante,
        estado
      });

      form.reset();
      // Restaurar fecha por defecto
      if (fechaInput) fechaInput.value = new Date().toISOString().split('T')[0];
      renderizarPartidos();
    } catch (error) {
      alert(error.message);
    }
  });
}

/**
 * Elimina un partido con confirmación
 */
window.eliminarPartido = function(id) {
  if (confirm('¿Deseas eliminar este registro de partido?')) {
    window.storageManager.deletePartido(id);
    renderizarPartidos();
  }
};
