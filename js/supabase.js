/**
 * ===================================================
 * Sistema de Tabla de Posiciones de Fútbol
 * Archivo: js/supabase.js
 * Descripción: Configuración del cliente Supabase y Capa de Datos Unificada
 * ===================================================
 */

// 1. Configuración de credenciales de Supabase
const SUPABASE_URL = 'TU_SUPABASE_URL_AQUI'; // Ej: https://xyzcompany.supabase.co
const SUPABASE_ANON_KEY = 'TU_SUPABASE_ANON_KEY_AQUI'; // Clave pública anónima (anon public)

// 2. Inicialización del cliente de Supabase
let supabaseClient = null;
const isSupabaseConfigured = () => {
  return typeof supabase !== 'undefined' &&
    SUPABASE_URL !== 'TU_SUPABASE_URL_AQUI' &&
    SUPABASE_URL.startsWith('http') &&
    SUPABASE_ANON_KEY !== 'TU_SUPABASE_ANON_KEY_AQUI';
};

if (isSupabaseConfigured()) {
  try {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('✅ Conectado a Supabase Cloud exitosamente.');
  } catch (err) {
    console.error('❌ Error al inicializar Supabase:', err);
  }
} else {
  console.info('ℹ️ Modo Local activo: el sistema está utilizando LocalStorage. Cuando agregues tus credenciales en js/supabase.js, se sincronizará automáticamente con Supabase.');
}

window.db = supabaseClient;

// 3. API Unificada para Vistas Públicas y Panel Administrador
// Si Supabase está configurado, consulta la nube; de lo contrario, opera en LocalStorage.
const api = {
  isCloud: isSupabaseConfigured,

  // --- AUTENTICACIÓN ---
  auth: {
    async login(email, password) {
      if (isSupabaseConfigured()) {
        const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
        if (error) throw error;
        return data.user;
      } else {
        // Fallback local para pruebas y desarrollo
        if (email === 'admin@torneo.com' && password === 'admin123') {
          const fakeUser = { email: 'admin@torneo.com', role: 'admin', id: 'local-admin-1' };
          localStorage.setItem('torneo_admin_session', JSON.stringify(fakeUser));
          return fakeUser;
        } else {
          throw new Error('Credenciales incorrectas. Para modo local utiliza: admin@torneo.com / admin123');
        }
      }
    },

    async logout() {
      if (isSupabaseConfigured()) {
        await supabaseClient.auth.signOut();
      }
      localStorage.removeItem('torneo_admin_session');
    },

    async getUser() {
      if (isSupabaseConfigured()) {
        const { data: { session } } = await supabaseClient.auth.getSession();
        return session ? session.user : null;
      } else {
        const local = localStorage.getItem('torneo_admin_session');
        return local ? JSON.parse(local) : null;
      }
    }
  },

  // --- EQUIPOS ---
  equipos: {
    async getAll() {
      if (isSupabaseConfigured()) {
        const { data, error } = await supabaseClient.from('equipos').select('*').order('id', { ascending: true });
        if (error) throw error;
        return data;
      }
      return window.storageManager.getEquipos();
    },

    async create(nombre, logo_url) {
      if (isSupabaseConfigured()) {
        const { data, error } = await supabaseClient.from('equipos').insert([{ nombre, logo_url }]).select().single();
        if (error) throw error;
        return data;
      }
      return window.storageManager.addEquipo(nombre, logo_url);
    },

    async update(id, { nombre, logo_url }) {
      if (isSupabaseConfigured()) {
        const { data, error } = await supabaseClient.from('equipos').update({ nombre, logo_url }).eq('id', id).select().single();
        if (error) throw error;
        return data;
      }
      return window.storageManager.updateEquipo(id, { nombre, logo_url });
    },

    async delete(id) {
      if (isSupabaseConfigured()) {
        const { error } = await supabaseClient.from('equipos').delete().eq('id', id);
        if (error) throw error;
        return true;
      }
      window.storageManager.deleteEquipo(id);
      return true;
    }
  },

  // --- PARTIDOS ---
  partidos: {
    async getAll() {
      if (isSupabaseConfigured()) {
        const { data, error } = await supabaseClient.from('partidos').select('*').order('jornada', { ascending: true });
        if (error) throw error;
        return data;
      }
      return window.storageManager.getPartidos();
    },

    async create(partido) {
      if (isSupabaseConfigured()) {
        const { data, error } = await supabaseClient.from('partidos').insert([partido]).select().single();
        if (error) throw error;
        return data;
      }
      return window.storageManager.addPartido(partido);
    },

    async update(id, datos) {
      if (isSupabaseConfigured()) {
        const { data, error } = await supabaseClient.from('partidos').update(datos).eq('id', id).select().single();
        if (error) throw error;
        return data;
      }
      return window.storageManager.updatePartido(id, datos);
    },

    async delete(id) {
      if (isSupabaseConfigured()) {
        const { error } = await supabaseClient.from('partidos').delete().eq('id', id);
        if (error) throw error;
        return true;
      }
      window.storageManager.deletePartido(id);
      return true;
    }
  },

  // --- CÁLCULO DE POSICIONES ---
  posiciones: {
    async calcular() {
      const equipos = await api.equipos.getAll();
      const partidos = await api.partidos.getAll();

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

        const loc = tabla[p.local_id || p.equipo_local_id];
        const vis = tabla[p.visitante_id || p.equipo_visitante_id];
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
};

window.api = api;
