const fs = require("fs")
fs.removeSync = require("fs-extra").removeSync
module.exports = fs;