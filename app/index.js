// Simple Express app instrumented with prom-client
const express = require('express');
const client = require('prom-client');

const register = client.register;
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ register });

const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.005, 0.01, 0.05, 0.1, 0.3, 1, 2, 5]
});

const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

const app = express();

app.use((req, res, next) => {
  const end = httpRequestDurationMicroseconds.startTimer();
  res.on('finish', () => {
    const route = req.route && req.route.path ? req.route.path : req.path;
    httpRequestsTotal.labels(req.method, route, String(res.statusCode)).inc();
    end({ method: req.method, route, status_code: res.statusCode });
  });
  next();
});

app.get('/', (req, res) => {
  res.send('Hello world — observability demo');
});

app.get('/error', (req, res) => {
  // endpoint to simulate errors for testing alerts
  res.status(500).send('Simulated error');
});

app.get('/slow', async (req, res) => {
  // endpoint to simulate latency
  await new Promise(r => setTimeout(r, 1200));
  res.send('Slow response');
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on :${PORT}`);
});
