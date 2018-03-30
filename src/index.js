const Bluebird = require('bluebird')
const inquirer = require('inquirer')
const SerialPort = require('serialport')

function Port (com) {
  return new Promise((resolve, reject) => {
    let port = new SerialPort(com, (error) => {
      if (error) {
        return reject(error)
      }
      resolve(port)
    })
  })
}

;(async () => {
  let ports = await SerialPort.list()

  let { com } = await inquirer.prompt([
    {
      name: 'com',
      type: 'list',
      message: 'Select com:',
      choices: ports.map((port) => ({
        name: `Com: ${port.comName}, PnP ID: ${port.pnpId}`,
        value: port.comName,
      })),
    },
  ])

  port = await Port(com)

  port.on('data', (data) => {
    console.log('data: ', data.toString())
  })

  port.write('hi')
})()
