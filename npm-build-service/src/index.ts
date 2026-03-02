import Fastify from 'fastify';
import cors from '@fastify/cors';
import { config } from './config.js';
import { buildRoutes } from './routes/build.js';
import { healthRoutes } from './routes/health.js';

const app = Fastify({
  logger: {
    level: process.env.LOG_LEVEL ?? 'info',
  },
});

await app.register(cors, { origin: true });
await app.register(healthRoutes, { prefix: '/api' });
await app.register(buildRoutes, { prefix: '/api' });

try {
  await app.listen({ port: config.port, host: '0.0.0.0' });
  app.log.info(`npm-build-service listening on port ${config.port}`);
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
