const path = require("path")
const exec = require("exec-then")
const fs = require("../helpers/fse");
let config = require("../config")

/* 
    Method:  Add | Override
    Paths: Controllers/ Models / Routes
*/

const dependencies = require("../dependencies")

// Read recursivaly all files in a directory
const getAllFiles = dir => {
    if (!dir.includes("node_modules")) {
        return fs.readdirSync(dir).reduce((files, file) => {
            const name = path.join(dir, file)
            const isDirectory = fs.statSync(name).isDirectory()
            return isDirectory ? [...files, ...getAllFiles(name)] : [...files, name]
          }, [])
    }
    return []
}

// TODO: Added custom structure according to project
const structure = ["model", "controller", "route"]
const templateMatching = type => `// *** ${type} ***`

async function checkSyntax(file) {
    await exec(`eslint ${file}`)
}

async function copyTo(type, fileFunction) {
    const { paths, method } = config;
    try {
        //await checkSyntax(fileFunction)
        const pathToCopy = paths[type]
        if (method === "add") {
            fs.copyFileSync(fileFunction, pathToCopy)
        }
    } catch (error) {
        console.log(error)
    }
}

function createStructure(filesPath) {
    filesPath.forEach(filePath => {
        const file = fs.readFileSync(filePath, "UTF-8")
        structure.forEach(type => {
            debugger
            if (file.includes(templateMatching(type))) {
                copyTo(type, file)
            }
        })
    })
}

function mapDir(dir) {
    const files = getAllFiles(dir)
    const jsFiles = files.filter(file => file.includes(".js"))
    createStructure(jsFiles)
}

function initConfig() {
    config = fs.readFileSync(path.join(process.cwd(), "config.json"), "utf-8") || config
    config = JSON.parse(config)
}

async function snippet() {
    initConfig()

    if (fs.existsSync("repo")) {
        fs.removeSync("repo")
    }

    const name = process.argv[2]

    if (!name) {
        throw "You must specify snippet name"
    }
    const repository = dependencies[name]

    const cloneRepository = await exec(`
        git clone ${repo} repo
    `)

    const execTest = await exec(`
        sh procedure.sh
    `);

    if (execTest.err) {
        console.error(execTest.err)       
        return; 
    }

    // Check files for copy 
    mapDir("repo")

    if (cloneRepository.err) {
        console.error(cloneRepository.err)        
        return;
    }
}

module.exports.snippet = snippet