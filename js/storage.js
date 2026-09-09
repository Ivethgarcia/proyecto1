/**
 * ===================================================
 * Sistema de Tabla de Posiciones de Fútbol
 * Archivo: js/storage.js
 * Descripción: Capa de almacenamiento local (LocalStorage)
 * Permite que el sistema funcione al 100% sin necesidad de servidor
 * y con la misma estructura para migrar a Supabase más adelante.
 * ===================================================
 */

const STORAGE_KEYS = {
  EQUIPOS: 'torneo_futbol_equipos',
  PARTIDOS: 'torneo_futbol_partidos'
};

// Equipos iniciales por defecto
const EQUIPOS_INICIALES = [
  { id: 1, nombre: 'Real Madrid', logo_url: '⚪' },
  { id: 2, nombre: 'FC Barcelona', logo_url: '🔵' },
  { id: 3, nombre: 'Atlético de Madrid', logo_url: '🔴' },
  { id: 4, nombre: 'Athletic Club', logo_url: '🦁' },
  { id: 5, nombre: 'Real Betis', logo_url: '🟢' },
  { id: 6, nombre: 'Sevilla FC', logo_url: '⚪' },
  { id: 7, nombre: 'Valencia CF', logo_url: '🦇' },
  { id: 8, nombre: 'UD Almería', logo_url: '🔴' }
];

// Partidos iniciales de ejemplo (Jornadas disputadas)
const PARTIDOS_INICIALES = [
  { id: 1, jornada: 1, fecha: '2026-08-15', local_id: 1, visitante_id: 2, goles_local: 3, goles_visitante: 1, estado: 'finalizado' },
  { id: 2, jornada: 1, fecha: '2026-08-16', local_id: 3, visitante_id: 4, goles_local: 2, goles_visitante: 0, estado: 'finalizado' },
  { id: 3, jornada: 1, fecha: '2026-08-17', local_id: 5, visitante_id: 6, goles_local: 2, goles_visitante: 2, estado: 'finalizado' },
  { id: 4, jornada: 1, fecha: '2026-08-18', local_id: 7, visitante_id: 8, goles_local: 1, goles_visitante: 1, estado: 'finalizado' },
  
  { id: 5, jornada: 2, fecha: '2026-08-22', local_id: 2, visitante_id: 3, goles_local: 2, goles_visitante: 1, estado: 'finalizado' },
  { id: 6, jornada: 2, fecha: '2026-08-23', local_id: 4, visitante_id: 1, goles_local: 0, goles_visitante: 2, estado: 'finalizado' },
  { id: 7, jornada: 2, fecha: '2026-08-24', local_id: 6, visitante_id: 7, goles_local: 3, goles_visitante: 0, estado: 'finalizado' },
  { id: 8, jornada: 2, fecha: '2026-08-25', local_id: 8, visitante_id: 5, goles_local: 0, goles_visitante: 3, estado: 'finalizado' }
];

class StorageManager {
  constructor() {
    this.init();
  }

  init() {
    if (!localStorage.getItem(STORAGE_KEYS.EQUIPOS)) {
      this.setEquipos(EQUIPOS_INICIALES);
    }
    if (!localStorage.getItem(STORAGE_KEYS.PARTIDOS)) {
      this.setPartidos(PARTIDOS_INICIALES);
    }
  }

  // --- MÉTODOS DE EQUIPOS ---
  getEquipos() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.EQUIPOS)) || [];
    } catch {
      return [];
    }
  }

  setEquipos(equipos) {
    localStorage.setItem(STORAGE_KEYS.EQUIPOS, JSON.stringify(equipos));
  }

  getEquipoById(id) {
    const equipos = this.getEquipos();
    return equipos.find(e => String(e.id) === String(id));
  }

  addEquipo(nombre, logo_url = '') {
    const equipos = this.getEquipos();
    const existe = equipos.some(e => e.nombre.toLowerCase().trim() === nombre.toLowerCase().trim());
    if (existe) {
      throw new Error(`El equipo "${nombre}" ya está registrado.`);
    }

    const nuevoId = equipos.length > 0 ? Math.max(...equipos.map(e => Number(e.id) || 0)) + 1 : 1;
    const nuevoEquipo = {
      id: nuevoId,
      nombre: nombre.trim(),
      logo_url: logo_url.trim() || '🛡️'
    };

    equipos.push(nuevoEquipo);
    this.setEquipos(equipos);
    return nuevoEquipo;
  }

  updateEquipo(id, { nombre, logo_url }) {
    const equipos = this.getEquipos();
    const index = equipos.findIndex(e => String(e.id) === String(id));
    if (index === -1) {
      throw new Error('Equipo no encontrado.');
    }

    const existeOtro = equipos.some(e => String(e.id) !== String(id) && e.nombre.toLowerCase().trim() === nombre.toLowerCase().trim());
    if (existeOtro) {
      throw new Error(`Ya existe otro equipo con el nombre "${nombre}".`);
    }

    equipos[index].nombre = nombre.trim();
    if (logo_url !== undefined) {
      equipos[index].logo_url = logo_url.trim() || '🛡️';
    }

    this.setEquipos(equipos);
    return equipos[index];
  }

  deleteEquipo(id) {
    let equipos = this.getEquipos();
    equipos = equipos.filter(e => String(e.id) !== String(id));
    this.setEquipos(equipos);

    // Eliminar también los partidos donde participaba este equipo
    let partidos = this.getPartidos();
    partidos = partidos.filter(p => String(p.local_id) !== String(id) && String(p.visitante_id) !== String(id));
    this.setPartidos(partidos);
  }

  // --- MÉTODOS DE PARTIDOS ---
  getPartidos() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.PARTIDOS)) || [];
    } catch {
      return [];
    }
  }

  setPartidos(partidos) {
    localStorage.setItem(STORAGE_KEYS.PARTIDOS, JSON.stringify(partidos));
  }

  getPartidoById(id) {
    const partidos = this.getPartidos();
    return partidos.find(p => String(p.id) === String(id));
  }

  addPartido(partido) {
    const partidos = this.getPartidos();
    if (String(partido.local_id) === String(partido.visitante_id)) {
      throw new Error('El equipo local y visitante no pueden ser el mismo.');
    }

    const nuevoId = partidos.length > 0 ? Math.max(...partidos.map(p => Number(p.id) || 0)) + 1 : 1;
    const nuevoPartido = {
      id: nuevoId,
      jornada: Number(partido.jornada) || 1,
      fecha: partido.fecha || new Date().toISOString().split('T')[0],
      local_id: Number(partido.local_id),
      visitante_id: Number(partido.visitante_id),
      goles_local: Number(partido.goles_local) || 0,
      goles_visitante: Number(partido.goles_visitante) || 0,
      estado: partido.estado || 'pendiente'
    };

    partidos.push(nuevoPartido);
    this.setPartidos(partidos);
    return nuevoPartido;
  }

  updatePartido(id, datos) {
    const partidos = this.getPartidos();
    const index = partidos.findIndex(p => String(p.id) === String(id));
    if (index === -1) {
      throw new Error('Partido no encontrado.');
    }

    if (datos.local_id && datos.visitante_id && String(datos.local_id) === String(datos.visitante_id)) {
      throw new Error('El equipo local y visitante no pueden ser el mismo.');
    }

    const partidoActual = partidos[index];
    partidos[index] = {
      ...partidoActual,
      jornada: datos.jornada !== undefined ? Number(datos.jornada) : partidoActual.jornada,
      fecha: datos.fecha !== undefined ? datos.fecha : partidoActual.fecha,
      local_id: datos.local_id !== undefined ? Number(datos.local_id) : partidoActual.local_id,
      visitante_id: datos.visitante_id !== undefined ? Number(datos.visitante_id) : partidoActual.visitante_id,
      goles_local: datos.goles_local !== undefined ? Number(datos.goles_local) : partidoActual.goles_local,
      goles_visitante: datos.goles_visitante !== undefined ? Number(datos.goles_visitante) : partidoActual.goles_visitante,
      estado: datos.estado !== undefined ? datos.estado : partidoActual.estado
    };

    this.setPartidos(partidos);
    return partidos[index];
  }

  deletePartido(id) {
    let partidos = this.getPartidos();
    partidos = partidos.filter(p => String(p.id) !== String(id));
    this.setPartidos(partidos);
  }

  // --- CÁLCULO DINÁMICO DE LA TABLA DE POSICIONES ---
  calcularPosiciones() {
    const equipos = this.getEquipos();
    const partidos = this.getPartidos();

    // Inicializar mapa de estadísticas para cada equipo
    const tabla = {};
    equipos.forEach(eq => {
      tabla[eq.id] = {
        id: eq.id,
        nombre: eq.nombre,
        logo_url: eq.logo_url,
        pj: 0,
        pg: 0,
        pe: 0,
        pp: 0,
        gf: 0,
        gc: 0,
        dg: 0,
        pts: 0
      };
    });

    // Procesar únicamente partidos finalizados
    partidos.forEach(p => {
      if (p.estado !== 'finalizado') return;

      const loc = tabla[p.local_id];
      const vis = tabla[p.visitante_id];
      if (!loc || !vis) return; // Si algún equipo fue eliminado

      const gl = Number(p.goles_local);
      const gv = Number(p.goles_visitante);

      // Partidos jugados
      loc.pj += 1;
      vis.pj += 1;

      // Goles
      loc.gf += gl;
      loc.gc += gv;
      vis.gf += gv;
      vis.gc += gl;

      // Resultado
      if (gl > gv) {
        // Gana local
        loc.pg += 1;
        loc.pts += 3;
        vis.pp += 1;
      } else if (gl < gv) {
        // Gana visitante
        vis.pg += 1;
        vis.pts += 3;
        loc.pp += 1;
      } else {
        // Empate
        loc.pe += 1;
        loc.pts += 1;
        vis.pe += 1;
        vis.pts += 1;
      }
    });

    // Calcular Diferencia de Goles y convertir a array
    const resultado = Object.values(tabla).map(item => {
      item.dg = item.gf - item.gc;
      return item;
    });

    // Ordenar posiciones según reglas estándar de fútbol:
    // 1. Puntos (PTS) descendente
    // 2. Diferencia de Goles (DG) descendente
    // 3. Goles a Favor (GF) descendente
    // 4. Nombre alfabético
    resultado.sort((a, b) => {
      if (b.pts !== a.pts) return b.pts - a.pts;
      if (b.dg !== a.dg) return b.dg - a.dg;
      if (b.gf !== a.gf) return b.gf - a.gf;
      return a.nombre.localeCompare(b.nombre);
    });

    return resultado;
  }

  // Reiniciar datos a los valores iniciales
  resetearTodo() {
    this.setEquipos(EQUIPOS_INICIALES);
    this.setPartidos(PARTIDOS_INICIALES);
  }
}

// Instancia global disponible en todo el proyecto
window.storageManager = new StorageManager();
