const path = require("path");
const inquirer = require("inquirer");
const { chalk, logger, utils, fs } = require("ppd-utils");
const validateProjectName = require("validate-npm-package-name");

const creater = require("../lib/creater");

async function create(projectName, cmd) {
    let options = utils.cleanArgs(cmd);

    if (options.proxy) {
        process.env.HTTP_PROXY = options.proxy;
    }

    const cwd = options.cwd || process.cwd();

    const inCurrent = projectName === ".";
    const name = inCurrent ? path.relative("../", cwd) : projectName;
    const targetDir = path.resolve(cwd, projectName || ".");

    const result = validateProjectName(name);
    if (!result.validForNewPackages) {
        logger.error(chalk.red(`Invalid project name: "${name}"`));
        result.errors && result.errors.forEach(err => {
            logger.error(chalk.red.dim("Error: " + err));
        });
        result.warnings && result.warnings.forEach(warining => {
            logger.warn(chalk.red.dim("Warning: " + warining));
        });
        exit(1);
    }

    if (fs.existsSync(targetDir)) {
        if (options.force) {
            await fs.remove(targetDir);
        } else {
            if (inCurrent) {
                const { ok } = await inquirer.prompt([
                    {
                        name: "ok",
                        type: "confirm",
                        message: `Generate project in current directory?`
                    }
                ])
                if (!ok) {
                    return;
                }
            } else {
                const { action } = await inquirer.prompt([
                    {
                        name: "action",
                        type: "list",
                        message: `Target directory ${chalk.cyan(targetDir)} already exists. Pick an action:`,
                        choices: [
                            { name: "Overwrite", value: "overwrite" },
                            { name: "Merge", value: "merge" },
                            { name: "Cancel", value: false }
                        ]
                    }
                ])
                if (!action) {
                    return;
                } else if (action === "overwrite") {
                    logger.log(`\nRemoving ${chalk.cyan(targetDir)}...`);
                    await fs.remove(targetDir);
                }
            }
        }
    }
    const { template } = await inquirer.prompt([
        {
            name: "template",
            type: "list",
            message: `请选择要使用的模板`,
            choices: [
                { name: "Vue", value: "vue" },
                { name: "React", value: "react" }
            ]
        }
    ])
    await creater(name, targetDir, { template, inCurrent, ...options });
}

module.exports = (projectName, options) => {
    return create(projectName, options).catch(err => {
        process.exit(1);
    })
}