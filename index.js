var docker = require('docker-remote-api')
var after = require('after-all')

var noop = function() {}

module.exports = function(opts, cb) {
  if (typeof opts === 'function') return module.exports(null, opts)
  if (!opts) opts = {}
  if (!cb) cb = noop

  var request = docker(opts.host, {version:'v1.15'})
  var result = {containers:0, images:0}

  var cleanContainers = function(cb) {
    request.get('/containers/json', {json:true, qs:{all:true}}, function(err, containers) {
      if (err) return cb(err)

      var next = after(cb)

      containers.forEach(function(c) {
        var n = next()

        request.get('/containers/'+c.Id+'/json', {json:true}, function(err, c) {
          if (err) return n(err)
          if (!opts.force && c.State && c.State.Running) return n()

          result.containers++
          request.del('/containers/'+c.Id, {drain:true, qs:{force:!!opts.force}}, n)
        })
      })
    })
  }

  var cleanImages = function(cb) {
    request.get('/images/json', {json:true}, function(err, images) {
      if (err) return cb(err)

      var next = after(cb)

      images.forEach(function(i) {
        if (i.RepoTags && i.RepoTags.length > 1) return
        if (i.RepoTags && i.RepoTags.length > 0 && i.RepoTags[0] !== '<none>:<none>') return

        result.images++
        request.del('/images/'+i.Id, {drain:true}, next())
      })
    })
  }

  var next = after(function(err) {
    if (err) return cb(err)
    cb(null, result)
  })

  if (opts.images !== false) cleanImages(next())
  if (opts.containers !== false) cleanContainers(next())
}