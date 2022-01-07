const os = require("os");
const path = require("path");
const inquirer = require("inquirer");
const { utils, chalk, logger, generator, merge } = require("ppd-utils");

const download = require("./download");
const install = require("./install");

async function create(name, targetDir, options) {
    let command = "";
    const username = path.basename(os.homedir());
    const inCurrent = options ? options.inCurrent : false;
    download(options)
        .then(target => {
            return {
                name: name,
                root: targetDir,
                temp: target
            };
        })
        .then(async context => {
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
                },
                {
                    name: "version",
                    message: "version",
                    default: "1.0.0"
                },
                {
                    name: "description",
                    message: "description",
                    default: `A project named ${context.name}`
                },
                {
                    name: "author",
                    message: "author",
                    default: username
                }
            ])
                .then(answers => {
                    command = answers.command;
                    return {
                        ...context,
                        metadata: {
                            name: name,
                            version: answers.version,
                            author: answers.author,
                            description: answers.description
                        }
                    };
                })
        })
        .then(context => {
            return generator(context.metadata, options.ignores, context.temp, inCurrent ? "." : context.name, metaParser);
        })
        .then(metadata => {
            return install(targetDir, command);
        })
        .then((context) => {
            logger.log(`🎉  Successfully created project ${chalk.yellow(name)}.`)
            logger.log(`👉  Get started with the following commands:\n`);
            if (!inCurrent) {
                logger.log(chalk.cyan(` ${chalk.gray("$")} cd ${name}`));
            }
            if (command === "yarn") {
                logger.log(chalk.cyan(` ${chalk.gray("$")} yarn dev\n`));
            } else {
                logger.log(chalk.cyan(` ${chalk.gray("$")} ${command} run dev\n`));
            }

        });
}

function metaParser(files, metalsmith, done) {
    const meta = metalsmith.metadata();
    Object.keys(files).forEach(fileName => {
        if (fileName === "package.json") {
            const contents = files[fileName].contents.toString();
            const data = merge(JSON.parse(contents), meta);
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