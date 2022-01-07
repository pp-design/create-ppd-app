const path = require("path");
const { logger, utils, chalk } = require("ppd-utils");

const validateProjectName = require("validate-npm-package-name");

const updater = require("../lib/updater");
const getIgnores = require("../lib/ignores");

const { hasProject, isVueProject, isReactProject } = require("../lib/utils");

async function update(projectName, cmd) {
    let options = utils.cleanArgs(cmd);

    if (options.proxy) {
        process.env.HTTP_PROXY = options.proxy;
    }

    const cwd = options.cwd || process.cwd();
    const inCurrent = projectName === ".";
    const name = inCurrent ? path.relative("../", cwd) : projectName;
    const targetDir = path.normalize(path.resolve(cwd, projectName || "."));
    const ignores = await getIgnores(targetDir);
    const result = validateProjectName(name);
    if (!result.validForNewPackages) {
        logger.error(chalk.red(`Invalid project name: "${name}"`));
        result.errors && result.errors.forEach(err => {
            logger.error(chalk.red.dim("Error: " + err));
        });
        result.warnings && result.warnings.forEach(warning => {
            logger.warn(chalk.red.dim("Warning: " + warning));
        });
        exit(1);
    }
    // if (!utils.hasProject(targetDir)) {
    //     logger.error(chalk.red.dim(`No Project named ${name} was found`));
    //     exit(1);1
    // }
    if (!hasProject(targetDir)) {
        logger.error(chalk.red.dim(`No Project named ${name} was found`));
        exit(1);
    }
    let template = "";
    if (hasProject(targetDir) && isVueProject(targetDir)) {
        template = "vue";
    }
    else if (hasProject(targetDir) && isReactProject(targetDir)) {
        template = "react";
    }
    await updater(name, targetDir, { inCurrent, template, ignores, ...options });
}

module.exports = (projectName, options) => {
    return update(projectName, options).catch(err => {
        process.exit(1);
    })
}
