[![Build Status](https://travis-ci.org/kaelzhang/node-pending-queue.svg?branch=master)](https://travis-ci.org/kaelzhang/node-pending-queue)
<!-- optional appveyor tst
[![Windows Build Status](https://ci.appveyor.com/api/projects/status/github/kaelzhang/node-pending-queue?branch=master&svg=true)](https://ci.appveyor.com/project/kaelzhang/node-pending-queue)
-->
<!-- optional npm version
[![NPM version](https://badge.fury.io/js/pending-queue.svg)](http://badge.fury.io/js/pending-queue)
-->
<!-- optional npm downloads
[![npm module downloads per month](http://img.shields.io/npm/dm/pending-queue.svg)](https://www.npmjs.org/package/pending-queue)
-->
<!-- optional dependency status
[![Dependency Status](https://david-dm.org/kaelzhang/node-pending-queue.svg)](https://david-dm.org/kaelzhang/node-pending-queue)
-->

# pending-queue

<!-- description -->

## Install

```sh
$ npm install pending-queue --save
```

## Usage

```js
const Queue = require('pending-queue')

let counter = 0
const queue = new Queue({
  load: (a, b) => {
    return new Promise((resolve) => {
      counter ++
      setTimeout(() => {
        resolve(a + b)
      }, 100)
    })
  }
})

function run () {
  queue.add(1, 2).then((value) => {
    console.log(value, counter)
  })
}

run()
run()
run()

// 3, 1
// 3, 1
// 3, 1

// So the load function ran only once.
```

##

## License

MIT
