// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://nvhbarzkpttetfrelyqt.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52aGJhcnprcHR0ZXRmcmVseXF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzNjkzODYsImV4cCI6MjA2Njk0NTM4Nn0.xkom1YAw-uhjK1CZ-PX2GXEq2JFSuRMLyCXIIj_7tJk'
)
