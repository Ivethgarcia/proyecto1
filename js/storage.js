/**
 * ===================================================
 * Sistema de Tabla de Posiciones de Fútbol
 * Archivo: js/storage.js
 * Descripción: Capa de almacenamiento local (LocalStorage)
 * Soporta: Equipos, Partidos, Jugadores y Goleadores (Pichichi)
 * ===================================================
 */

const STORAGE_KEYS = {
  EQUIPOS: 'torneo_futbol_equipos',
  PARTIDOS: 'torneo_futbol_partidos',
  JUGADORES: 'torneo_futbol_jugadores',
  GOLES: 'torneo_futbol_goles'
};

// 1. Equipos iniciales por defecto
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

// 2. Jugadores iniciales por defecto
const JUGADORES_INICIALES = [
  // Real Madrid (id: 1)
  { id: 1, equipo_id: 1, nombre: 'Kylian Mbappé', numero: 9, posicion: 'Delantero', foto_url: '⭐' },
  { id: 2, equipo_id: 1, nombre: 'Vinícius Júnior', numero: 7, posicion: 'Delantero', foto_url: '⚽' },
  { id: 3, equipo_id: 1, nombre: 'Jude Bellingham', numero: 5, posicion: 'Mediocampista', foto_url: '👟' },
  // FC Barcelona (id: 2)
  { id: 4, equipo_id: 2, nombre: 'Robert Lewandowski', numero: 9, posicion: 'Delantero', foto_url: '⚽' },
  { id: 5, equipo_id: 2, nombre: 'Lamine Yamal', numero: 19, posicion: 'Delantero', foto_url: '⚡' },
  { id: 6, equipo_id: 2, nombre: 'Raphinha', numero: 11, posicion: 'Delantero', foto_url: '⚽' },
  // Atlético de Madrid (id: 3)
  { id: 7, equipo_id: 3, nombre: 'Antoine Griezmann', numero: 7, posicion: 'Delantero', foto_url: '⚽' },
  { id: 8, equipo_id: 3, nombre: 'Julián Álvarez', numero: 19, posicion: 'Delantero', foto_url: '🕷️' },
  // Athletic Club (id: 4)
  { id: 9, equipo_id: 4, nombre: 'Nico Williams', numero: 10, posicion: 'Delantero', foto_url: '⚡' },
  { id: 10, equipo_id: 4, nombre: 'Iñaki Williams', numero: 9, posicion: 'Delantero', foto_url: '🦁' },
  // Real Betis (id: 5)
  { id: 11, equipo_id: 5, nombre: 'Isco Alarcón', numero: 22, posicion: 'Mediocampista', foto_url: '🪄' },
  // Sevilla FC (id: 6)
  { id: 12, equipo_id: 6, nombre: 'Isaac Romero', numero: 20, posicion: 'Delantero', foto_url: '⚽' },
  // Valencia CF (id: 7)
  { id: 13, equipo_id: 7, nombre: 'Hugo Duro', numero: 9, posicion: 'Delantero', foto_url: '⚽' },
  // UD Almería (id: 8)
  { id: 14, equipo_id: 8, nombre: 'Luis Suárez', numero: 9, posicion: 'Delantero', foto_url: '⚽' }
];

// 3. Partidos iniciales de ejemplo
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

// 4. Goles iniciales vinculados a partidos y futbolistas
const GOLES_INICIALES = [
  // Partido 1 (RM 3 - 1 FCB)
  { id: 1, partido_id: 1, jugador_id: 1, equipo_id: 1, minuto: 14 },
  { id: 2, partido_id: 1, jugador_id: 1, equipo_id: 1, minuto: 56 },
  { id: 3, partido_id: 1, jugador_id: 2, equipo_id: 1, minuto: 78 },
  { id: 4, partido_id: 1, jugador_id: 4, equipo_id: 2, minuto: 89 },

  // Partido 2 (ATM 2 - 0 ATH)
  { id: 5, partido_id: 2, jugador_id: 7, equipo_id: 3, minuto: 30 },
  { id: 6, partido_id: 2, jugador_id: 8, equipo_id: 3, minuto: 65 },

  // Partido 3 (BET 2 - 2 SEV)
  { id: 7, partido_id: 3, jugador_id: 11, equipo_id: 5, minuto: 12 },
  { id: 8, partido_id: 3, jugador_id: 11, equipo_id: 5, minuto: 44 },
  { id: 9, partido_id: 3, jugador_id: 12, equipo_id: 6, minuto: 50 },
  { id: 10, partido_id: 3, jugador_id: 12, equipo_id: 6, minuto: 82 },

  // Partido 4 (VAL 1 - 1 ALM)
  { id: 11, partido_id: 4, jugador_id: 13, equipo_id: 7, minuto: 25 },
  { id: 12, partido_id: 4, jugador_id: 14, equipo_id: 8, minuto: 70 },

  // Partido 5 (FCB 2 - 1 ATM)
  { id: 13, partido_id: 5, jugador_id: 4, equipo_id: 2, minuto: 21 },
  { id: 14, partido_id: 5, jugador_id: 4, equipo_id: 2, minuto: 60 },
  { id: 15, partido_id: 5, jugador_id: 7, equipo_id: 3, minuto: 40 },

  // Partido 6 (ATH 0 - 2 RM)
  { id: 16, partido_id: 6, jugador_id: 1, equipo_id: 1, minuto: 33 },
  { id: 17, partido_id: 6, jugador_id: 1, equipo_id: 1, minuto: 81 },

  // Partido 7 (SEV 3 - 0 VAL)
  { id: 18, partido_id: 7, jugador_id: 12, equipo_id: 6, minuto: 15 },
  { id: 19, partido_id: 7, jugador_id: 12, equipo_id: 6, minuto: 39 },
  { id: 20, partido_id: 7, jugador_id: 12, equipo_id: 6, minuto: 88 },

  // Partido 8 (ALM 0 - 3 BET)
  { id: 21, partido_id: 8, jugador_id: 11, equipo_id: 5, minuto: 10 },
  { id: 22, partido_id: 8, jugador_id: 11, equipo_id: 5, minuto: 55 },
  { id: 23, partido_id: 8, jugador_id: 11, equipo_id: 5, minuto: 75 }
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
    if (!localStorage.getItem(STORAGE_KEYS.JUGADORES)) {
      this.setJugadores(JUGADORES_INICIALES);
    }
    if (!localStorage.getItem(STORAGE_KEYS.GOLES)) {
      this.setGoles(GOLES_INICIALES);
    }
  }

  // ==========================================
  // MÉTODOS DE EQUIPOS
  // ==========================================
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

    // Eliminar también los jugadores asociados
    let jugadores = this.getJugadores();
    jugadores = jugadores.filter(j => String(j.equipo_id) !== String(id));
    this.setJugadores(jugadores);

    // Limpiar goles
    let goles = this.getGoles();
    goles = goles.filter(g => String(g.equipo_id) !== String(id));
    this.setGoles(goles);
  }

  // ==========================================
  // MÉTODOS DE JUGADORES
  // ==========================================
  getJugadores(equipo_id = null) {
    try {
      const todos = JSON.parse(localStorage.getItem(STORAGE_KEYS.JUGADORES)) || [];
      if (equipo_id !== null && equipo_id !== undefined && equipo_id !== '' && equipo_id !== 'todos') {
        return todos.filter(j => String(j.equipo_id) === String(equipo_id));
      }
      return todos;
    } catch {
      return [];
    }
  }

  setJugadores(jugadores) {
    localStorage.setItem(STORAGE_KEYS.JUGADORES, JSON.stringify(jugadores));
  }

  getJugadorById(id) {
    const jugadores = this.getJugadores();
    return jugadores.find(j => String(j.id) === String(id));
  }

  addJugador({ equipo_id, nombre, numero, posicion, foto_url }) {
    const jugadores = this.getJugadores();
    if (!equipo_id) throw new Error('Debes asignar un equipo al jugador.');
    if (!nombre || !nombre.trim()) throw new Error('El nombre del jugador es requerido.');
    if (!numero || Number(numero) <= 0) throw new Error('El número de camiseta debe ser mayor a 0.');

    // Verificar si ya existe el dorsal en ese equipo
    const dorsalExiste = jugadores.some(j => String(j.equipo_id) === String(equipo_id) && Number(j.numero) === Number(numero));
    if (dorsalExiste) {
      throw new Error(`El dorsal #${numero} ya está asignado a otro jugador de este equipo.`);
    }

    const nuevoId = jugadores.length > 0 ? Math.max(...jugadores.map(j => Number(j.id) || 0)) + 1 : 1;
    const nuevoJugador = {
      id: nuevoId,
      equipo_id: Number(equipo_id),
      nombre: nombre.trim(),
      numero: Number(numero),
      posicion: posicion || 'Delantero',
      foto_url: foto_url && foto_url.trim() ? foto_url.trim() : '⚽'
    };

    jugadores.push(nuevoJugador);
    this.setJugadores(jugadores);
    return nuevoJugador;
  }

  updateJugador(id, datos) {
    const jugadores = this.getJugadores();
    const index = jugadores.findIndex(j => String(j.id) === String(id));
    if (index === -1) throw new Error('Jugador no encontrado.');

    const jugador = jugadores[index];
    const equipoId = datos.equipo_id !== undefined ? Number(datos.equipo_id) : jugador.equipo_id;
    const numero = datos.numero !== undefined ? Number(datos.numero) : jugador.numero;

    // Verificar dorsal duplicado en el mismo equipo
    const dorsalExiste = jugadores.some(j => String(j.id) !== String(id) && String(j.equipo_id) === String(equipoId) && Number(j.numero) === Number(numero));
    if (dorsalExiste) {
      throw new Error(`El dorsal #${numero} ya está en uso por otro jugador de este equipo.`);
    }

    jugadores[index] = {
      ...jugador,
      equipo_id: equipoId,
      nombre: datos.nombre !== undefined ? datos.nombre.trim() : jugador.nombre,
      numero: numero,
      posicion: datos.posicion !== undefined ? datos.posicion : jugador.posicion,
      foto_url: datos.foto_url !== undefined && datos.foto_url.trim() ? datos.foto_url.trim() : jugador.foto_url
    };

    this.setJugadores(jugadores);
    return jugadores[index];
  }

  deleteJugador(id) {
    let jugadores = this.getJugadores();
    jugadores = jugadores.filter(j => String(j.id) !== String(id));
    this.setJugadores(jugadores);

    // Limpiar goles del jugador
    let goles = this.getGoles();
    goles = goles.filter(g => String(g.jugador_id) !== String(id));
    this.setGoles(goles);
  }

  // ==========================================
  // MÉTODOS DE PARTIDOS
  // ==========================================
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

    // Limpiar goles del partido
    this.deleteGolesByPartido(id);
  }

  // ==========================================
  // MÉTODOS DE GOLES
  // ==========================================
  getGoles(partido_id = null) {
    try {
      const todos = JSON.parse(localStorage.getItem(STORAGE_KEYS.GOLES)) || [];
      if (partido_id !== null && partido_id !== undefined) {
        return todos.filter(g => String(g.partido_id) === String(partido_id));
      }
      return todos;
    } catch {
      return [];
    }
  }

  setGoles(goles) {
    localStorage.setItem(STORAGE_KEYS.GOLES, JSON.stringify(goles));
  }

  setGolesPartido(partido_id, listaGoles) {
    let todos = this.getGoles();
    // Eliminar los goles previos de este partido
    todos = todos.filter(g => String(g.partido_id) !== String(partido_id));

    let maxId = todos.length > 0 ? Math.max(...todos.map(g => Number(g.id) || 0)) : 0;

    const nuevosGoles = listaGoles.map(g => ({
      id: ++maxId,
      partido_id: Number(partido_id),
      jugador_id: Number(g.jugador_id),
      equipo_id: Number(g.equipo_id),
      minuto: g.minuto ? Number(g.minuto) : null
    }));

    todos.push(...nuevosGoles);
    this.setGoles(todos);
    return nuevosGoles;
  }

  deleteGolesByPartido(partido_id) {
    let todos = this.getGoles();
    todos = todos.filter(g => String(g.partido_id) !== String(partido_id));
    this.setGoles(todos);
  }

  // ==========================================
  // CÁLCULO DE TABLA DE GOLEADORES (PICHICHI)
  // ==========================================
  calcularTablaGoleadores() {
    const jugadores = this.getJugadores();
    const goles = this.getGoles();
    const equipos = this.getEquipos();
    const partidos = this.getPartidos();

    // Contar goles por jugador
    const mapaGoles = {};
    goles.forEach(g => {
      mapaGoles[g.jugador_id] = (mapaGoles[g.jugador_id] || 0) + 1;
    });

    // Construir lista de goleadores
    const lista = jugadores.map(j => {
      const eq = equipos.find(e => String(e.id) === String(j.equipo_id)) || { nombre: 'Sin Club', logo_url: '🛡️' };
      const totalGoles = mapaGoles[j.id] || 0;

      // Calcular partidos disputados por su equipo
      const partidosEquipo = partidos.filter(p => 
        p.estado === 'finalizado' && (String(p.local_id) === String(j.equipo_id) || String(p.visitante_id) === String(j.equipo_id))
      ).length;

      const promedio = partidosEquipo > 0 ? (totalGoles / partidosEquipo).toFixed(2) : '0.00';

      return {
        id: j.id,
        nombre: j.nombre,
        numero: j.numero,
        posicion: j.posicion,
        foto_url: j.foto_url,
        equipo_id: j.equipo_id,
        equipo_nombre: eq.nombre,
        equipo_logo: eq.logo_url,
        goles: totalGoles,
        partidos_jugados: partidosEquipo,
        promedio: promedio
      };
    });

    // Ordenar: mayor cantidad de goles primero, luego alfabético
    lista.sort((a, b) => {
      if (b.goles !== a.goles) return b.goles - a.goles;
      return a.nombre.localeCompare(b.nombre);
    });

    return lista;
  }

  obtenerPichichi() {
    const goleadores = this.calcularTablaGoleadores();
    if (goleadores.length === 0 || goleadores[0].goles === 0) return null;
    return goleadores[0];
  }

  // ==========================================
  // CÁLCULO DE LA TABLA DE POSICIONES
  // ==========================================
  calcularPosiciones() {
    const equipos = this.getEquipos();
    const partidos = this.getPartidos();

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

    partidos.forEach(p => {
      if (p.estado !== 'finalizado') return;

      const loc = tabla[p.local_id];
      const vis = tabla[p.visitante_id];
      if (!loc || !vis) return;

      const gl = Number(p.goles_local);
      const gv = Number(p.goles_visitante);

      loc.pj += 1;
      vis.pj += 1;
      loc.gf += gl;
      loc.gc += gv;
      vis.gf += gv;
      vis.gc += gl;

      if (gl > gv) {
        loc.pg += 1;
        loc.pts += 3;
        vis.pp += 1;
      } else if (gl < gv) {
        vis.pg += 1;
        vis.pts += 3;
        loc.pp += 1;
      } else {
        loc.pe += 1;
        loc.pts += 1;
        vis.pe += 1;
        vis.pts += 1;
      }
    });

    const resultado = Object.values(tabla).map(item => {
      item.dg = item.gf - item.gc;
      return item;
    });

    resultado.sort((a, b) => {
      if (b.pts !== a.pts) return b.pts - a.pts;
      if (b.dg !== a.dg) return b.dg - a.dg;
      if (b.gf !== a.gf) return b.gf - a.gf;
      return a.nombre.localeCompare(b.nombre);
    });

    return resultado;
  }
}

// Instancia global disponible en todo el proyecto
window.storageManager = new StorageManager();
