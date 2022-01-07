const os = require("os");
const path = require("path");
const download = require("download-git-repo");
const { logger, chalk, fs, rm, execa } = require("ppd-utils");

const template = require("./template");

function getRepository(options) {
    let { git: url } = options || {};
    if (!url) {
        const { template: name = "default" } = options || {};
        const len = template ? template.length : 0;
        for (let i = 0; i < len; i++) {
            // console.log(template[i], name)
            if (template[i].name === name) {
                url = template[i].repository;
                break;
            }
        }
    }
    return url;
}

module.exports = function (options) {
    const url = getRepository(options);
    const tmpdir = path.join(os.tmpdir(), "ppd-cli");
    if (fs.existsSync(tmpdir)) {
        rm.sync(tmpdir);
    }

    return new Promise(async function (resolve, reject) {
        logger.log(chalk.cyan(`it is downloading template, This might take a while......`));

        download(`direct:${url}`, tmpdir, { clone: true, stdio: ["inherit", "inherit", "inherit"] }, (err) => {
            if (err) {
                logger.log(chalk.green(`template project has been successfully downloaded！`));
                reject(err);
            } else {
                resolve(tmpdir);
            }
        });
    })
}