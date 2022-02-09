const path = require("path");
const merge = require("lodash/merge");
const { chalk, logger, generator, fs } = require("ppd-utils");

const download = require("./download");

async function update(name, targetDir, options) {
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
            return {
                metadata,
                ...context
            };
        })
        .then(context => {
            return generator(context.metadata, options.ignores, context.temp, inCurrent ? "." : context.name, metaParser);
        })
        .then((context) => {
            logger.log(`🎉  Successfully created project ${chalk.yellow(name)}.`)
            logger.log(`👉  Get started with the following commands:\n`);
            if (!inCurrent) {
                logger.log(chalk.cyan(` ${chalk.gray("$")} cd ${name}`));
            }

            logger.log(chalk.cyan(` ${chalk.gray("$")} yarn`));
            logger.log(chalk.cyan(` ${chalk.gray("$")} yarn dev\n`));
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
    return update(name, targetDir, options).catch((err) => {
        logger.error(err);
        process.exit(1);
    });
};