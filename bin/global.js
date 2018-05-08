#!/usr/bin/env node

const myLibrary = require('../lib/index.js');
myLibrary.snippet()
    .catch(e => {
        console.error(e)
    })
