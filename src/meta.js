export const minify = true;
export const obfuscate = false;

/** @type {import('./meta.d.ts').Meta} */
export const meta = {
	name: '%package.name%',
	description: '%package.description%',
	version: '%package.version%',
	author: '%package.author%',

	iconURL: 'https://www.google.com/s2/favicons?sz=128&domain=zelenka.guru',

	match: ['*://lolz.live/*', '*://localhost/*'],
	grant: ['none'],

	'run-at': 'document-start',
	noframes: true,

	webRequest: [
		{
			selector: '*://lolz.live/js/lolzteam/im/im_socket.js?_v=*',
			action: {
				redirect: 'http://localhost/v1/im_socket.js',
			},
		},
	],
};
