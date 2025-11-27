import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
const supabaseUrl = 'https://iyfvvzbtsfhodtdzjtya.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5ZnZ2emJ0c2Zob2R0ZHpqdHlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxODEzNDMsImV4cCI6MjA3OTc1NzM0M30.RP23t5ErcbzdyEELIP5HMNU37QwHQD0OoM_9S9UNuGI';

// Crear y exportar el cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos útiles para TypeScript (puedes expandirlos según tus tablas)
export type SupabaseClient = typeof supabase;

