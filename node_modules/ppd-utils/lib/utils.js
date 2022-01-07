const fs = require("fs-extra");
const path = require("path");
const execa = require("execa");

function camelize(str) {
    return str.replace(/-(\w)/g, (_, c) => c ? c.toUpperCase() : '')
}

function cleanArgs(cmd) {
    const args = {};
    cmd.options.forEach(o => {
        const key = camelize(o.long.replace(/^--/, ''));
        if (typeof cmd[key] !== 'function' && typeof cmd[key] !== 'undefined') {
            args[key] = cmd[key];
        }
    })
    return args;
}

async function hasCommand(command) {
    try {
        await execa(command, ["--version"], { stdio: "ignore" });
        return true;
    } catch (e) {
        return false;
    }
}

function hasProject(targetDir) {
    const package = path.join(targetDir, "package.json");
    if (fs.pathExistsSync(package)) {
        return true;
    }
    return false;
}

exports.hasCommand = hasCommand;
exports.cleanArgs = cleanArgs;
exports.hasProject = hasProject;