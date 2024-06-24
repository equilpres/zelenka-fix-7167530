import fs from 'node:fs/promises';
import path from 'node:path';

import type { FastifyInstance } from 'fastify';

const scriptPath = path.join(process.cwd(), 'static', 'im_socket.js');

export function imSocket(fastify: FastifyInstance) {
	fastify.get<{
		Reply: string;
	}>('/im_socket.js', async (_, reply) => {
		const script = await fs.readFile(scriptPath, 'utf-8');

		reply.type('application/javascript; charset=utf-8').send(script);
	});
}
