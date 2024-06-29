// ==UserScript==
// @name         zelenka-fix-7167530
// @description  Boilerplate for Tampermonkey userscripts in TypeScript
// @version      0.0.0
// @author       Слава Соколов (equilpres)
// @iconURL      https://lolz.live/styles/brand/download/avatars/three_avatar.svg
// @match        *://lolz.live/*
// @match        *://localhost/*
// @grant        none
// @run-at       document-start
// @noframes
// @webRequest   [{"selector":"*://lolz.live/js/lolzteam/im/im_socket.js?_v=*","action":{"redirect":"http://localhost/v1/im_socket.js"}},{"selector":"*://lolz.live/js/lolzteam/ng/notify/im.js?_v=*","action":{"redirect":"http://localhost/v1/im.js"}}]
// ==/UserScript==

/* eslint-disable */
console.log("Script injected");
