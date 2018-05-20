const path = require("path")
const exec = require("exec-then")
const fs = require("../helpers/fse");
let config = require("../config")
const rp = require("request-promise")
const unzip = require("unzip")
const fse = require("fs-extra")

const API_ROOT = "http://localhost:3000"

/* 
    Method:  Add | Override
    Paths: Controllers/ Models / Routes
*/
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

async function copyTo(type,  fileFunction) {
    const { paths, method } = config;
    try {
        const pathToCopy = paths[type]
        if (method === "add") {
            const fileName = path.parse(fileFunction).base;
            fs.copyFileSync(fileFunction, `${process.cwd()}/${pathToCopy}/${fileName}`)
        }
    } catch (error) {
        console.log(error)
    }
}

function createStructure(filesPath) {
    filesPath.forEach(filePath => {
        const file = fs.readFileSync(filePath, "UTF-8")
        structure.forEach(type => {
            if (file.includes(templateMatching(type))) {
                copyTo(type, filePath)
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
    config = !(config instanceof Object)? JSON.parse(config) : config
}

async function validateSnippet(snippet) {
    try {
        const opts = {
            url: `${API_ROOT}/${snippet}/check`,
            encoding: null
        }
        const body = await rp(opts)
        return new Promise((resolve, reject) => {
            fs.writeFile(`${snippet}.zip`, body, function(err) {
                fs.createReadStream(`${snippet}.zip`).pipe(unzip.Extract({ path: snippet }));
                resolve(true);
            });
        })
    } catch (error) {
        return false;
    }
}

function clean(snippet) {
    fse.removeSync(snippet)
    fse.removeSync(`${snipper}.zip`)
}

async function snippet() {
    initConfig()
    
    if (fs.existsSync("repo")) {
        fs.removeSync("repo")
    }

    const snippetName = process.argv[2]

    if (!snippetName) {
        throw "You must specify snippet name"
    }
    const isValid = await validateSnippet(snippetName)
    if (isValid) {
        mapDir(snippetName)
        clean(snippetName)
    }

}

module.exports.snippet = snippet