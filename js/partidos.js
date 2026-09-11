/**
 * ===================================================
 * Sistema de Tabla de Posiciones de Fútbol
 * Archivo: js/partidos.js
 * Descripción: Gestión administrativa de Partidos y Marcadores
 * Incluye asignación interactiva de Goleadores por equipo
 * Compatible con Supabase y LocalStorage
 * ===================================================
 */

let modalEdicionPartido = null;
let equiposCache = [];
let partidosCache = [];

// Variables temporales para el modal de edición
let jugadoresLocalModal = [];
let jugadoresVisitanteModal = [];
let golesActualesModal = [];
let partidoActivoId = null;
let equipoLocalActivoId = null;
let equipoVisitanteActivoId = null;

document.addEventListener('DOMContentLoaded', async () => {
  const modalEl = document.getElementById('modalEditarPartido');
  if (modalEl && typeof bootstrap !== 'undefined') {
    modalEdicionPartido = new bootstrap.Modal(modalEl);
  }

  await cargarSelectsEquipos();
  await renderizarPartidos();
  configurarFormularioCrearPartido();
  configurarFormularioEditarPartido();
  configurarListenersMarcadorModal();
});

/**
 * Llena los selectores de equipo local y visitante en el formulario de creación
 */
async function cargarSelectsEquipos() {
  const selectLocal = document.getElementById('equipo-local');
  const selectVisitante = document.getElementById('equipo-visitante');
  if (!selectLocal || !selectVisitante) return;

  try {
    equiposCache = await window.api.equipos.getAll();

    const opciones = equiposCache.map(eq => `<option value="${eq.id}">${eq.nombre}</option>`).join('');

    selectLocal.innerHTML = `<option value="" selected disabled>Selecciona local...</option>` + opciones;
    selectVisitante.innerHTML = `<option value="" selected disabled>Selecciona visitante...</option>` + opciones;
  } catch (err) {
    console.error('Error al cargar equipos en selectores:', err);
  }
}

/**
 * Renderiza la lista de partidos en la tabla del panel admin
 */
async function renderizarPartidos() {
  const tbody = document.getElementById('lista-partidos-body');
  const contador = document.getElementById('contador-partidos');
  if (!tbody) return;

  try {
    if (equiposCache.length === 0) {
      equiposCache = await window.api.equipos.getAll();
    }
    partidosCache = await window.api.partidos.getAll();

    if (contador) {
      contador.textContent = `${partidosCache.length} Partidos`;
    }

    if (partidosCache.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" class="text-center py-4 text-muted">
            <i class="bi bi-info-circle me-1"></i> No hay partidos programados. Registra uno usando el formulario.
          </td>
        </tr>
      `;
      return;
    }

    const ordenados = [...partidosCache].sort((a, b) => b.jornada - a.jornada);
    const getEquipo = (id) => equiposCache.find(e => String(e.id) === String(id)) || { nombre: 'Equipo', logo_url: '🛡️' };

    tbody.innerHTML = ordenados.map(p => {
      const locId = p.local_id || p.equipo_local_id;
      const visId = p.visitante_id || p.equipo_visitante_id;
      const local = getEquipo(locId);
      const visitante = getEquipo(visId);

      const esFinalizado = p.estado === 'finalizado';
      const marcador = esFinalizado 
        ? `<span class="badge bg-dark px-2 py-1">${p.goles_local} - ${p.goles_visitante}</span>` 
        : `<span class="badge bg-light text-muted border">vs</span>`;
      
      const estadoBadge = esFinalizado 
        ? `<span class="badge bg-success-subtle text-success border border-success-subtle">Finalizado</span>` 
        : `<span class="badge bg-warning-subtle text-warning border border-warning-subtle">Pendiente</span>`;

      return `
        <tr>
          <td class="fw-bold text-muted text-center">${p.jornada}</td>
          <td>
            <div class="d-flex align-items-center gap-2">
              <span>${local.logo_url && local.logo_url.startsWith('http') ? `<img src="${local.logo_url}" style="width: 20px; height: 20px;">` : (local.logo_url || '🛡️')}</span>
              <span class="fw-semibold text-truncate" style="max-width: 110px;">${local.nombre}</span>
            </div>
          </td>
          <td class="text-center">${marcador}</td>
          <td>
            <div class="d-flex align-items-center gap-2">
              <span>${visitante.logo_url && visitante.logo_url.startsWith('http') ? `<img src="${visitante.logo_url}" style="width: 20px; height: 20px;">` : (visitante.logo_url || '🛡️')}</span>
              <span class="fw-semibold text-truncate" style="max-width: 110px;">${visitante.nombre}</span>
            </div>
          </td>
          <td class="text-center">${estadoBadge}</td>
          <td class="text-center">
            <div class="btn-group btn-group-sm" role="group">
              <button class="btn btn-outline-primary" onclick="abrirModalEditarPartido(${p.id})" title="Actualizar marcador y goleadores">
                <i class="bi bi-pencil-square"></i> Marcador
              </button>
              <button class="btn btn-outline-danger" onclick="eliminarPartido(${p.id})" title="Eliminar partido">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  } catch (err) {
    console.error('Error al renderizar partidos:', err);
  }
}

/**
 * Formulario para crear un nuevo partido
 */
function configurarFormularioCrearPartido() {
  const form = document.getElementById('form-partido');
  const btn = document.getElementById('btn-guardar-partido');
  if (!form) return;

  const fechaInput = document.getElementById('fecha-partido');
  if (fechaInput && !fechaInput.value) {
    fechaInput.value = new Date().toISOString().split('T')[0];
  }

  form.addEventListener('submit', async (e) => {
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

    if (String(local_id) === String(visitante_id)) {
      alert('Un equipo no puede jugar contra sí mismo.');
      return;
    }

    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span>Guardando...';
    }

    try {
      await window.api.partidos.create({
        jornada: Number(jornada),
        fecha,
        local_id: Number(local_id),
        equipo_local_id: Number(local_id),
        visitante_id: Number(visitante_id),
        equipo_visitante_id: Number(visitante_id),
        goles_local: Number(goles_local) || 0,
        goles_visitante: Number(goles_visitante) || 0,
        estado
      });

      form.reset();
      if (fechaInput) fechaInput.value = new Date().toISOString().split('T')[0];
      await renderizarPartidos();
    } catch (error) {
      alert(error.message || 'Error al registrar el partido.');
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = '<i class="bi bi-save me-1"></i> Guardar Partido';
      }
    }
  });
}

/**
 * Abre el modal para editar el marcador y asignar goleadores
 */
window.abrirModalEditarPartido = async function(id) {
  const partido = partidosCache.find(p => String(p.id) === String(id));
  if (!partido) return;

  partidoActivoId = partido.id;
  equipoLocalActivoId = partido.local_id || partido.equipo_local_id;
  equipoVisitanteActivoId = partido.visitante_id || partido.equipo_visitante_id;

  const local = equiposCache.find(e => String(e.id) === String(equipoLocalActivoId)) || { nombre: 'Local' };
  const visitante = equiposCache.find(e => String(e.id) === String(equipoVisitanteActivoId)) || { nombre: 'Visitante' };

  document.getElementById('edit-partido-id').value = partido.id;
  document.getElementById('edit-nombre-local').textContent = local.nombre;
  document.getElementById('edit-nombre-visitante').textContent = visitante.nombre;
  document.getElementById('edit-encuentro-info').textContent = `Jornada ${partido.jornada} • Fecha: ${partido.fecha || 'Sin fecha'}`;

  document.getElementById('label-goleadores-local').textContent = `Goles de ${local.nombre}:`;
  document.getElementById('label-goleadores-visitante').textContent = `Goles de ${visitante.nombre}:`;

  document.getElementById('edit-goles-local').value = partido.goles_local || 0;
  document.getElementById('edit-goles-visitante').value = partido.goles_visitante || 0;
  document.getElementById('edit-estado-partido').value = partido.estado || 'pendiente';
  document.getElementById('edit-jornada').value = partido.jornada || 1;
  document.getElementById('edit-fecha').value = partido.fecha || new Date().toISOString().split('T')[0];

  // Cargar jugadores de ambos clubes y los goles registrados para este encuentro
  try {
    jugadoresLocalModal = await window.api.jugadores.getAll(equipoLocalActivoId);
    jugadoresVisitanteModal = await window.api.jugadores.getAll(equipoVisitanteActivoId);
    golesActualesModal = await window.api.goles.getByPartido(partido.id);

    renderizarCamposGoleadores();
  } catch (err) {
    console.error('Error al cargar datos de goleadores para el modal:', err);
  }

  if (modalEdicionPartido) {
    modalEdicionPartido.show();
  }
};

/**
 * Escucha cambios en los campos de goles para ajustar dinámicamente los selectores de goleadores
 */
function configurarListenersMarcadorModal() {
  const inputGL = document.getElementById('edit-goles-local');
  const inputGV = document.getElementById('edit-goles-visitante');

  if (inputGL) inputGL.addEventListener('input', () => renderizarCamposGoleadores());
  if (inputGV) inputGV.addEventListener('input', () => renderizarCamposGoleadores());
}

/**
 * Renderiza los selectores de goleadores según el número de goles de cada equipo
 */
function renderizarCamposGoleadores() {
  const contLocal = document.getElementById('contenedor-goleadores-local');
  const contVis = document.getElementById('contenedor-goleadores-visitante');
  const badgeInfo = document.getElementById('badge-total-goles-info');
  if (!contLocal || !contVis) return;

  const gl = Math.max(0, parseInt(document.getElementById('edit-goles-local').value) || 0);
  const gv = Math.max(0, parseInt(document.getElementById('edit-goles-visitante').value) || 0);

  if (badgeInfo) {
    badgeInfo.textContent = `${gl + gv} gol(es) totales`;
  }

  // Filtrar goles previos que coincidan con cada equipo
  const golesPreviosLocal = (golesActualesModal || []).filter(g => String(g.equipo_id) === String(equipoLocalActivoId));
  const golesPreviosVis = (golesActualesModal || []).filter(g => String(g.equipo_id) === String(equipoVisitanteActivoId));

  // Generar campos de goles local
  if (gl === 0) {
    contLocal.innerHTML = '<span class="text-muted small">Sin goles para este equipo.</span>';
  } else {
    contLocal.innerHTML = Array.from({ length: gl }, (_, i) => {
      const golPrev = golesPreviosLocal[i];
      const opciones = jugadoresLocalModal.map(j => 
        `<option value="${j.id}" ${golPrev && String(golPrev.jugador_id) === String(j.id) ? 'selected' : ''}>#${j.numero} ${j.nombre}</option>`
      ).join('');

      return `
        <div class="input-group input-group-sm">
          <span class="input-group-text bg-light text-muted">⚽ Gol ${i + 1}</span>
          <select class="form-select selector-gol-local" required>
            <option value="" ${!golPrev ? 'selected' : ''} disabled>Selecciona anotador...</option>
            ${opciones}
          </select>
          <input type="number" class="form-control minuto-gol-local" placeholder="Min'" min="1" max="120" style="max-width: 65px;" value="${golPrev && golPrev.minuto ? golPrev.minuto : ''}">
        </div>
      `;
    }).join('');
  }

  // Generar campos de goles visitante
  if (gv === 0) {
    contVis.innerHTML = '<span class="text-muted small">Sin goles para este equipo.</span>';
  } else {
    contVis.innerHTML = Array.from({ length: gv }, (_, i) => {
      const golPrev = golesPreviosVis[i];
      const opciones = jugadoresVisitanteModal.map(j => 
        `<option value="${j.id}" ${golPrev && String(golPrev.jugador_id) === String(j.id) ? 'selected' : ''}>#${j.numero} ${j.nombre}</option>`
      ).join('');

      return `
        <div class="input-group input-group-sm">
          <span class="input-group-text bg-light text-muted">⚽ Gol ${i + 1}</span>
          <select class="form-select selector-gol-visitante" required>
            <option value="" ${!golPrev ? 'selected' : ''} disabled>Selecciona anotador...</option>
            ${opciones}
          </select>
          <input type="number" class="form-control minuto-gol-visitante" placeholder="Min'" min="1" max="120" style="max-width: 65px;" value="${golPrev && golPrev.minuto ? golPrev.minuto : ''}">
        </div>
      `;
    }).join('');
  }
}

/**
 * Formulario para guardar la edición del marcador y los goleadores asignados
 */
function configurarFormularioEditarPartido() {
  const formEdit = document.getElementById('form-editar-partido');
  const btnEdit = document.getElementById('btn-guardar-edicion-partido');
  if (!formEdit) return;

  formEdit.addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = document.getElementById('edit-partido-id').value;
    const goles_local = Number(document.getElementById('edit-goles-local').value) || 0;
    const goles_visitante = Number(document.getElementById('edit-goles-visitante').value) || 0;
    const estado = document.getElementById('edit-estado-partido').value;
    const jornada = document.getElementById('edit-jornada').value;
    const fecha = document.getElementById('edit-fecha').value;

    // Recolectar lista de goleadores seleccionados
    const listaGoles = [];

    // Goleadores del equipo local
    const selectsLocal = document.querySelectorAll('.selector-gol-local');
    const minsLocal = document.querySelectorAll('.minuto-gol-local');
    selectsLocal.forEach((sel, i) => {
      if (sel.value) {
        listaGoles.push({
          partido_id: Number(id),
          equipo_id: Number(equipoLocalActivoId),
          jugador_id: Number(sel.value),
          minuto: minsLocal[i] && minsLocal[i].value ? Number(minsLocal[i].value) : null
        });
      }
    });

    // Goleadores del equipo visitante
    const selectsVis = document.querySelectorAll('.selector-gol-visitante');
    const minsVis = document.querySelectorAll('.minuto-gol-visitante');
    selectsVis.forEach((sel, i) => {
      if (sel.value) {
        listaGoles.push({
          partido_id: Number(id),
          equipo_id: Number(equipoVisitanteActivoId),
          jugador_id: Number(sel.value),
          minuto: minsVis[i] && minsVis[i].value ? Number(minsVis[i].value) : null
        });
      }
    });

    if (btnEdit) {
      btnEdit.disabled = true;
      btnEdit.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span>Guardando marcador...';
    }

    try {
      // 1. Actualizar el partido
      await window.api.partidos.update(id, {
        goles_local,
        goles_visitante,
        estado,
        jornada: Number(jornada),
        fecha
      });

      // 2. Guardar los registros de goles de los futbolistas
      await window.api.goles.setPartidoGoles(id, listaGoles);

      if (modalEdicionPartido) {
        modalEdicionPartido.hide();
      }
      await renderizarPartidos();
    } catch (error) {
      alert(error.message || 'Error al actualizar el partido y goleadores.');
    } finally {
      if (btnEdit) {
        btnEdit.disabled = false;
        btnEdit.innerHTML = '<i class="bi bi-check2-circle me-1"></i> Guardar Marcador';
      }
    }
  });
}

/**
 * Elimina un partido con confirmación
 */
window.eliminarPartido = async function(id) {
  if (confirm('¿Deseas eliminar este registro de encuentro? También se eliminarán sus registros de goles asociados.')) {
    try {
      await window.api.partidos.delete(id);
      await renderizarPartidos();
    } catch (err) {
      alert('Error al eliminar partido: ' + err.message);
    }
  }
};
