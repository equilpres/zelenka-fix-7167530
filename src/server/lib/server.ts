import cors from '@fastify/cors';
import etag from '@fastify/etag';
import fastify from 'fastify';

import { routes } from '../routes.js';

export const server = fastify();

server.setNotFoundHandler((_, reply) => {
	reply.status(404).send({
		ok: false,
	});
});

server.setErrorHandler((err, _, reply) => {
	console.error(err);

	reply.status(500).send({
		ok: false,
	});
});

server.register(cors, {
	origin: '*',
	credentials: true,
	preflightContinue: true,
});

server.register(etag);

server.register(routes, {
	prefix: '/v1/',
});
