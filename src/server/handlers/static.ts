import fs from 'node:fs/promises';
import path from 'node:path';

import type { FastifyInstance } from 'fastify';

const staticPath = path.join(process.cwd(), 'static');

export function staticRoute(fastify: FastifyInstance) {
	fastify.get<{
		Params: {
			path: string;
		};
		Reply: string;
	}>('/:path', async (request, reply) => {
		const script = await fs.readFile(path.join(staticPath, request.params.path), 'utf-8');

		reply.type('application/javascript; charset=utf-8').send(script);
	});
}
