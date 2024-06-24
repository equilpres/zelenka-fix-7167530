import type { FastifyError, FastifyInstance, FastifyServerOptions } from 'fastify';

import { handlers } from './handlers/mod.js';

export function routes(fastify: FastifyInstance, _: FastifyServerOptions, done: (err?: FastifyError) => void) {
	handlers.map((handler) => handler(fastify));

	done();
}
