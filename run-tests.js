const Mocha = require('mocha');
const fs = require('fs');
const path = require('path');

// Instantiate a Mocha instance.
const mocha = new Mocha();
const testDir = './repo/test'

// Add each .js file to the mocha instance
fs.readdirSync(testDir)
    .filter((file) => file.substr(-3) === '.js')
    .forEach(function(file) {
        mocha.addFile(
            path.join(testDir, file)
        );
    });

// Run the tests.
mocha.run(function(failures){
    if (failures > 0) {
        process.exit();
    }
});

setTimeout(() => {
    process.exit();
}, 10000)
