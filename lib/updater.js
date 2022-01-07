const path = require("path");
const inquirer = require("inquirer");
const { chalk, logger, generator, fs, merge } = require("ppd-utils");

const download = require("./download");
const install = require("./install");
const { exit } = require("process");
const { option } = require("commander");

async function create(name, targetDir, options) {
    let command = "";
    const inCurrent = options ? options.inCurrent : false;
    download(options)
        .then(target => {
            return {
                name: name,
                temp: target
            };
        })
        .then(async context => {
            let metadata = {};
            const packagePath = path.join(targetDir, "package.json");
            if (fs.pathExistsSync(packagePath)) {
                const packageConfig = require(packagePath);
                metadata = packageConfig || {};
            }

            const commands = await require("./command")();
            command = commands && commands.length ? commands[0].value : "npm";
            return inquirer.prompt([
                    {
                        name: "command",
                        type: "list",
                        message: "Pick the package manager to use when installing dependencies:",
                        choices: commands,
                        default: command,
                        when: () => {
                            return commands && commands.length > 1;
                        }
                    }
                ])
                .then(answers => {
                    command = answers.command;
                    return {
                        metadata,
                        ...context
                    };
                });
        })
        .then(context => {
            return generator(context.metadata, options.ignores, context.temp, inCurrent ? "." : context.name, metaParser);
        })
        .then(metadata => {
            return install(targetDir, command);
        })
        .then((context) => {
            logger.log(`🎉  Successfully update project ${chalk.yellow(name)}.`)
            logger.log(`👉  Get started with the following commands:\n`);
            if (!inCurrent) {
                logger.log(chalk.cyan(` ${chalk.gray("$")} cd ${name}`));
            }
            if (command === "yarn") {
                if(options.template == 'react'){
                    logger.log(chalk.cyan(` ${chalk.gray("$")} yarn start\n`));
                    return
                }
                logger.log(chalk.cyan(` ${chalk.gray("$")} yarn dev\n`));
            } else {
                if(options.template == 'react'){
                    logger.log(chalk.cyan(` ${chalk.gray("$")} npm run start\n`));
                    return
                }
                logger.log(chalk.cyan(` ${chalk.gray("$")} ${command} run dev\n`));
            }
        });
}

function metaParser(files, metalsmith, done) {
    const meta = metalsmith.metadata();
    Object.keys(files).forEach(fileName => {
        if (fileName === "package.json") {
            const contents = files[fileName].contents.toString();
            const data = merge(meta, JSON.parse(contents));
            files[fileName].contents = JSON.stringify(data, null, 4);
        }
    });
    done();
}

module.exports = (name, targetDir, options) => {
    return create(name, targetDir, options).catch((err) => {
        logger.error(err);
        process.exit(1);
    });
};