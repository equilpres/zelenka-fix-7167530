// ==UserScript==
// @name         zelenka-fix-7167530
// @description  Boilerplate for Tampermonkey userscripts in TypeScript
// @version      0.0.0
// @author       Слава Соколов (equilpres)
// @iconURL      https://www.google.com/s2/favicons?sz=128&domain=zelenka.guru
// @match        *://lolz.live/*
// @match        *://pub-2c6eb843124a4b7c91c44760fe682184.r2.dev/*
// @grant        none
// @run-at       document-start
// @noframes
// @webRequest   [{"selector":"*://lolz.live/js/lolzteam/im/im_socket.js?_v=*","action":{"redirect":"https://pub-2c6eb843124a4b7c91c44760fe682184.r2.dev/v1/im_socket.js"}}]
// ==/UserScript==

/* eslint-disable */
console.log("Script injected");
