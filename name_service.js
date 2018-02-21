const express = require('express');
const app = express();
const { Tracer } = require('zipkin');
const zipkinMiddleware = require('zipkin-instrumentation-express').expressMiddleware;
const CLSContext = require('zipkin-context-cls');
const recorder = require('./recorder');

const ctxImpl = new CLSContext();
const tracer = new Tracer({ ctxImpl, recorder });

const fetch = require('node-fetch');
const wrapFetch = require('zipkin-instrumentation-fetch');
const zipkinFetch = wrapFetch(fetch, {
  tracer,
  serviceName: 'name_service'
});

// app.use(zipkinMiddleware({
//   tracer,
//   serviceName: 'first_name_service' // name of this application
// }));

app.get('/', (req, res) => {
    Promise.all([
      zipkinFetch('http://localhost:8010'),
      zipkinFetch('http://localhost:8020')
    ])
    .then(([ first, last ]) => {
      return Promise.all([
        first.text(),
        last.text()
      ]);  
    })
    .then(([ first, last ]) => {
      res.send(`${first} ${last}`);
    })
    .catch(err => res.sendStatus(500));
  });

const server = app.listen(8080, () => {
  var host = server.address().address;
  var port = server.address().port;

  console.log('name_service listening at http://%s:%s', host, port);
});