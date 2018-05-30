#!/usr/bin/env node

const sniptor = require('../lib/index.js');
sniptor.snippet()
    .catch(e => {
        console.error(e)
    })
