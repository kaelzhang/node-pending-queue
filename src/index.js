const {EventEmitter} = require('events')
const assert = require('assert')

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
    const stringify = this._stringify
    return this._add(stringify(args), args)
  }

  addWithKey (key, ...args) {
    return this._add(key, args)
  }

  _add (key, args) {
    return new Promise((resolve, reject) => {
      this._run(key, args, (err, data) => {
        if (err) {
          return reject(err)
        }

        resolve(data)
      })
    })
  }

  _run (key, args, callback) {
    this.on(key, callback)
    if (this.listenerCount(key) !== 1) {
      return
    }

    // Avoid load method to access the context of pending-queue
    const load = this._load
    Promise.resolve(load(...args))
    .then(
      data => {
        this.emit('load', key, data)
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
