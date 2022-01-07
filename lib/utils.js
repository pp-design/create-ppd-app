
const { chalk, logger, utils, fs } = require("ppd-utils");
const path = require("path");


function isVueProject(targetDir) {
    const package = path.join(targetDir, "package.json");
    const vueconfig = path.join(targetDir, "vue.config.js");
    if (fs.pathExistsSync(package) && fs.pathExistsSync(vueconfig)) {
        return true;
    }
    return false;
}

function isReactProject(targetDir) {
    const package = path.join(targetDir, "package.json");
    const reactconfig = path.join(targetDir, "config-overrides.js");
    if (fs.pathExistsSync(package) && fs.pathExistsSync(reactconfig)) {
        return true;
    }
    return false;
}

function hasProject(targetDir) {
    const package = path.join(targetDir, "package.json");
    const vueconfig = path.join(targetDir, "vue.config.js");
    const reactconfig = path.join(targetDir, "config-overrides.js");
    if (fs.pathExistsSync(package) && (fs.pathExistsSync(vueconfig) || fs.pathExistsSync(reactconfig))) {
        return true;
    }
    return false;
}

exports.hasProject = hasProject;
exports.isVueProject = isVueProject;
exports.isReactProject = isReactProject;