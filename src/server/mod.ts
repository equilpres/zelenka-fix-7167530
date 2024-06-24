import { server } from './lib/server.js';

const port = 80;

await server.listen({
	port,
	host: '::',
});

console.log(`Server started on port ${port}`);
