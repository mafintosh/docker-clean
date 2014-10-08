# docker-clean

Clean up unused docker containers and images

```
npm install docker-clean
```

Or to install the command line tool

```
npm install -g docker-clean
docker-clean --help
```

## Usage

``` js
var clean = require('docker-clean')

clean(function(err, result) {
  console.log('Cleaned up %d containers and %d images', result.containers, result.images)
})

// or to force remove running containers as well

clean({force: true}, function(err) {
  ...
})
```

Other options include

``` js
{
  host: 'optional-docker-host', // override $DOCKER_HOST
  images: false, // do not remove images
  containers: false, // do not remove containers
  force: true // also remove running containers
}
```

## License

MIT
