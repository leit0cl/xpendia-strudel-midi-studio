import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    // Forzamos una única instancia de @strudel/core (y los singletons relacionados)
    // así el registro global de sonidos/patterns es compartido entre paquetes.
    dedupe: [
      '@strudel/core',
      '@strudel/mini',
      '@strudel/tonal',
      '@strudel/transpiler',
      '@strudel/webaudio',
      '@strudel/draw',
      'superdough',
    ],
  },
})
