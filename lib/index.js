const path = require("path");
const inquirer = require("inquirer");
const { chalk, logger, utils, fs } = require("ppd-utils");
const validateProjectName = require("validate-npm-package-name");

const creater = require("./creater");
const updater = require("./updater");

module.exports = async function createPPDApp(projectName, cmd) {
    const options = utils.cleanArgs({ options: [], ...cmd });

    if (options.proxy) {
        process.env.HTTP_PROXY = options.proxy;
    }

    let type = "create";

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
            const { action } = await inquirer.prompt([
                {
                    name: "action",
                    type: "list",
                    message: `文件夹 ${chalk.cyan(targetDir)} 已存在，请选择:`,
                    choices: [
                        { name: "替换", value: "overwrite" },
                        { name: "合并", value: "merge" },
                        { name: "取消", value: false }
                    ]
                }
            ])
            if (!action) {
                return;
            } else if (action === "overwrite") {
                logger.log(`\n正在删除 ${chalk.cyan(targetDir)}...`);
                await fs.emptyDir(targetDir);
            } else if (action === "merge") {
                type = "update";
            }
        }
    }

    const { template } = await inquirer.prompt([
        {
            name: "template",
            type: "list",
            message: `请选择要使用的模板`,
            choices: [
                { name: "Vue3", value: "vue3" },
                { name: "React", value: "react" }
            ]
        }
    ])

    if (type === "create") {
        await creater(name, targetDir, { template, inCurrent, ...options });
    } else if (type === "update") {
        await updater(name, targetDir, { template, inCurrent, ...options });
    }
}