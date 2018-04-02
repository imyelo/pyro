import SerialPort from 'serialport'
import store from '../store'

let cached = {}

export function Port (com, options = {}) {
  return new Promise((resolve, reject) => {
    if (com in cached) {
      return resolve(cached[com])
    }
    let port = new SerialPort(com, options, (error) => {
      if (error) {
        return reject(error)
      }
      resolve(port)
    })

    port.on('data', (data) => {
      store.dispatch('log', { type: 'info', message: `Received a message from hardware: ${data.toString()}` })
    })
    port.on('end', () => {
      store.dispatch('log', { type: 'info', message: `Received a serial-port-end event.` })
    })

    cached[com] = port
  })
}

export function close () {
  for (let com in cached) {
    cached[com].end()
    delete cached[com]
  }
}
