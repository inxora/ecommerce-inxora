#!/usr/bin/env node
/**
 * Reinicia el servidor de desarrollo automáticamente si se detiene.
 * Uso: npm run dev:watch
 * Útil cuando la terminal o el entorno cierra el proceso por inactividad.
 */
const { spawn } = require('child_process')

function run() {
  const isWindows = process.platform === 'win32'
  const child = spawn(isWindows ? 'npm.cmd' : 'npm', ['run', 'dev'], {
    stdio: 'inherit',
    shell: true,
    cwd: __dirname + '/..'
  })

  child.on('exit', (code, signal) => {
    if (code != null || signal) {
      console.log('\n[dev:watch] Servidor detenido. Reiniciando en 3 segundos... (Ctrl+C para salir)\n')
      setTimeout(run, 3000)
    }
  })
}

run()
