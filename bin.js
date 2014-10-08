#!/usr/bin/env node

var clean = require('docker-clean')
var minimist = require('minimist')
var fs = require('fs')

var argv = minimist(process.argv.slice(2), {
  alias: {
    force: 'f',
    host: 'H'
  },
  boolean: ['force', 'help']
})

var onerror = function(err) {
  console.error('Error: %s', err.message)
  process.exit(1)
}

if (argv.help) {
  console.error(fs.readFileSync(require.resolve('./help.txt'), 'utf-8'))
  process.exit(0)
}

if (argv.version) {
  console.log(require('./package.json').version)
  process.exit(0)
}

clean(argv, function(err, result) {
  if (err) return onerror(err)
  console.log('Removed %d unused container(s) and %d unused image(s)', result.containers, result.images)
})