-- Invalidación de JWT al cerrar sesión: el backend compara iat/exp del token con cliente.ultimo_logout.
-- Ejecutar en Supabase (SQL editor o CLI) cuando el API use esta columna.

ALTER TABLE public.cliente
  ADD COLUMN IF NOT EXISTS ultimo_logout TIMESTAMPTZ NULL;

COMMENT ON COLUMN public.cliente.ultimo_logout IS
  'Al hacer logout se actualiza a NOW(); tokens emitidos antes quedan inválidos.';
