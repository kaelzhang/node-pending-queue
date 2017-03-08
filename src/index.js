const {EventEmitter} = require('events')
const assert = require('assert')
const is = require('p-is-promise')

module.exports = class Queue extends EventEmitter {

  _stringify = JSON.stringify

  constructor (options) {
    super()
    this.setMaxListeners(0)

    assert(Object(options) === options, 'options must be an object')

    const {
      load,
      stringify
    } = options
    assert(typeof load === 'function', 'options.load must be a function')
    this._load = load

    if (stringify) {
      this._stringify = stringify
    }
  }

  add (...args) {
    return new Promise((resolve, reject) => {
      this._add(args, (err, data) => {
        if (err) {
          return reject(err)
        }

        resolve(data)
      })
    })
  }

  _add (args, callback) {
    const key = this._stringify(args)

    this.on(key, callback)
    if (this.listenerCount(key) !== 1) {
      return
    }

    // Avoid load method to access the context of pending-queue
    const load = this._load
    thenify(load(...args))
    .then(
      data => {
        this.emit(key, null, data)
        this.removeAllListeners(key)
      },

      err => {
        this.emit(key, err)
        this.removeAllListeners(key)
      }
    )
  }
}


function thenify (value) {
  return is(value)
    ? value
    : Promise.resolve(value)
}
