const path = require("path")
const exec = require("exec-then")
const fs = require("fs")
let config = require("../config")

 // Method:  Insert | Override
const dependencies = require("../dependencies")

// Read recursivaly all files in a directory
const getAllFiles = dir =>
fs.readdirSync(dir).reduce((files, file) => {
  const name = path.join(dir, file)
  const isDirectory = fs.statSync(name).isDirectory()
  return isDirectory ? [...files, ...getAllFiles(name)] : [...files, name]
}, [])

// TODO: Added custom structure according to project
const structure = ["model", "controller", "route"]
const templateMatching = (type) => `
    // *** ${type} ***
`

function copyTo(type, fileFunction) {
    const pathToCopy = config[type];
    fs.copyFileSync(fileFunction, pathToCopy);
}

function createStructure(filesPath) {
    const structureFolders = {}
    structure.forEach((val) => {
        structureFolders[val] = []    
    })

    filesPath.forEach(filePath => {
        const file = fs.readFileSync(filePath, "UTF-8")
        structure.forEach(type => {
            if(file.includes(templateMatching(type))) {
                structureFolders[type].push(filePath)
            }
        })
    })
    structure.forEach(dir => {
        structureFolders[dir].forEach(file => {
            copyTo(dir, file)
        })
    })
}

function mapDir(dir) {
    const files = getAllFiles(dir)
    const pgFiles = files.filter(file => file.includes(".js"))
    createStructure(pgFiles)
}

function initConfig() {
    config = fs.readFileSync(path.join(process.cwd(), "config.json"), "utf-8");
    config = JSON.parse(config);
}

async function snippet() {
    initConfig();

    if (fs.existsSync("repo")) {
        await exec("rm -rf repo")
    }

    const testsCommand = "";
    const name = process.argv[2]
    const repo = dependencies[name]

    const command = `git clone ${repo} repo`
    const res = await exec(command)

    mapDir("repo")
    if (res.err) {
        console.error(res.err)        
    }

    await exec("cd repo; npm install;")
    const respTest = await exec(testsCommand)
    if (respTest.err) {
        console.error(res.err)        
    }

    // After do all stuff delete temporal repo
    await exec("rm -rf repo")
}

module.exports.snippet = snippet