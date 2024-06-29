export const minify = true;
export const obfuscate = false;

/** @type {import('./meta.d.ts').Meta} */
export const meta = {
	name: '%package.name%',
	description: '%package.description%',
	version: '%package.version%',
	author: '%package.author%',

	iconURL: 'https://lolz.live/styles/brand/download/avatars/three_avatar.svg',

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
		{
			selector: '*://lolz.live/js/lolzteam/ng/notify/im.js?_v=*',
			action: {
				redirect: 'http://localhost/v1/im.js',
			},
		},
	],
};
