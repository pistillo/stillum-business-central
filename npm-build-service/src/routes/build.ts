import type { FastifyPluginAsync } from 'fastify';
import { executeBuild } from '../services/build-orchestrator.js';
import type {
  BuildRequest,
  BuildErrorResponse,
  BuildResponse,
} from '../types/build.js';
import { BuildError } from '../types/build.js';

const buildRequestSchema = {
  type: 'object',
  required: [
    'tenantId',
    'artifactId',
    'versionId',
    'artifactTitle',
    'artifactType',
    'version',
    'sourceCode',
    'npmDependencies',
  ],
  properties: {
    tenantId: { type: 'string' },
    artifactId: { type: 'string' },
    versionId: { type: 'string' },
    artifactTitle: { type: 'string' },
    artifactType: { type: 'string', enum: ['MODULE', 'COMPONENT'] },
    version: { type: 'string' },
    sourceCode: { type: 'string' },
    npmDependencies: { type: 'object' },
    components: {
      type: 'array',
      items: {
        type: 'object',
        required: ['artifactId', 'title', 'sourceCode'],
        properties: {
          artifactId: { type: 'string' },
          title: { type: 'string' },
          sourceCode: { type: 'string' },
        },
      },
    },
  },
} as const;

export const buildRoutes: FastifyPluginAsync = async (app) => {
  app.post<{ Body: BuildRequest }>(
    '/build',
    { schema: { body: buildRequestSchema } },
    async (request, reply) => {
      try {
        const result: BuildResponse = await executeBuild(request.body);
        return result;
      } catch (error) {
        if (error instanceof BuildError) {
          const errorResponse: BuildErrorResponse = {
            success: false,
            error: error.message,
            phase: error.phase,
            details: error.details,
          };
          return reply.status(400).send(errorResponse);
        }

        const errorResponse: BuildErrorResponse = {
          success: false,
          error: 'Internal build error',
          phase: 'SETUP',
          details: String(error),
        };
        return reply.status(500).send(errorResponse);
      }
    },
  );
};
