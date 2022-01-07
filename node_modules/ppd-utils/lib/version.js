
const path = require("path");
const fs = require("fs-extra");
const semver = require("semver");
const latestVersion = require("latest-version");

const merge = require("./merge");

const chalk = require("chalk");
const logger = require("./logger");

const cwd = process.cwd();

async function getVersion(packageName) {
    const package = await getPackage();
    const { dependencies, devDependencies } = package || {};
    const allDependencies = merge(devDependencies, dependencies);
    if (allDependencies && allDependencies.hasOwnProperty(packageName)) {
        const version = allDependencies[packageName];
        return version.replace(/^\^/gi, "");
    }
    return null;
}

async function getPackage() {
    const url = path.join(cwd, "package.json");
    const isExists = await fs.pathExistsSync(url);
    if (isExists) {
        return require(url);
    }
    return null;
}

module.exports = async (packageName, minVersion) => {
    try {
        const lv = await latestVersion(packageName);
        const cv = minVersion || await getVersion(packageName);
        if (semver.compare(lv, cv) === 1) {
            return true;
        }
        return false;
    } catch (error) {
        logger.log(chalk.red(`No Package named ${chalk.cyan(packageName)} was found`));
        return false;
    }
};