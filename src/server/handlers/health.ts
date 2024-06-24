import type { FastifyInstance } from 'fastify';

import type { BasicResponse } from './types.js';

export function health(fastify: FastifyInstance) {
	fastify.get<{
		Reply: BasicResponse;
	}>('/health', (_, reply) => {
		reply.send({
			ok: true,
		});
	});
}
