/**
 * ===================================================
 * Sistema de Tabla de Posiciones de Fútbol
 * Archivo: js/supabase.js
 * Descripción: Configuración y cliente de conexión con Supabase
 * ===================================================
 */

// 1. REEMPLAZA ESTOS VALORES CON LOS DE TU PROYECTO DE SUPABASE
// Los encuentras en tu panel de Supabase: Project Settings -> API
const SUPABASE_URL = 'TU_SUPABASE_URL_AQUI'; // Ej: https://xyzcompany.supabase.co
const SUPABASE_ANON_KEY = 'TU_SUPABASE_ANON_KEY_AQUI'; // Clave pública anónima (anon public)

// 2. Inicialización del cliente de Supabase
let supabaseClient = null;

if (typeof supabase !== 'undefined' && SUPABASE_URL !== 'TU_SUPABASE_URL_AQUI') {
  try {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('✅ Cliente de Supabase inicializado correctamente.');
  } catch (error) {
    console.error('❌ Error al inicializar Supabase:', error);
  }
} else {
  console.warn('⚠️ Supabase aún no está configurado con tus credenciales. Edita js/supabase.js con tu URL y ANON KEY.');
}

// Exportar globalmente para que esté accesible desde equipos.js, partidos.js y posiciones.js
window.db = supabaseClient;
