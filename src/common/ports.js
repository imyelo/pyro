import SerialPort from 'serialport'
import EventEmitter from 'eventemitter3'
import is from 'electron-is'
import { remote } from 'electron'

const VARIABLE_NAME_OF_PORTS_IN_MAIN_GLOBAL = 'COMMON_PORTS'

const SERIAL_PORT_EVENTS =  ['open', 'data', 'readable', 'end', 'error']

class Ports extends EventEmitter {
  constructor () {
    super()

    this.opened = {}
  }

  select (com, options = {}) {
    return new Promise((resolve, reject) => {
      if (com in this.opened) {
        let used = this.opened[com]

        if (used.isOpen) {
          return resolve(used)
        }

        return used.open((error) => {
          if (error) {
            return reject(error)
          }
          resolve(used)
        })
      }

      let port = new SerialPort(com, options, (error) => {
        if (error) {
          return reject(error)
        }

        SERIAL_PORT_EVENTS.forEach((event) => {
          port.on(event, (...args) => this.emit(event, port, ...args))
        })

        this.opened[com] = port

        resolve(port)
      })
    })
  }

  close () {
    let count = 0
    for (let com in this.opened) {
      this.opened[com].close()
      delete this.opened[com]
      count += 1
    }
    this.emit('close-all', { count })
  }
}

let ports

if (is.main()) {
  global[VARIABLE_NAME_OF_PORTS_IN_MAIN_GLOBAL] = new Ports()
  ports = global[VARIABLE_NAME_OF_PORTS_IN_MAIN_GLOBAL]
} else {
  ports = remote.getGlobal(VARIABLE_NAME_OF_PORTS_IN_MAIN_GLOBAL)
}

export default ports
