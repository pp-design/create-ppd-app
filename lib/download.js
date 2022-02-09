const os = require("os");
const path = require("path");
const download = require("download-git-repo");
const { logger, chalk, fs, rm } = require("ppd-utils");

const template = require("./template");

function getRepository(options) {
    let { git: url } = options || {};
    if (!url) {
        const { template: name = "default" } = options || {};
        const len = template ? template.length : 0;
        for (let i = 0; i < len; i++) {
            if (template[i].name === name) {
                url = template[i].repository;
                break;
            }
        }
    }
    return url;
}

module.exports = function (options) {
    const { template } = options || {};
    const url = getRepository(options);

    const tmpdir = path.join(os.tmpdir(), `create-ppd-app/${template}`);
    if (fs.existsSync(tmpdir)) {
        rm.sync(tmpdir);
    }
    
    return new Promise(async function (resolve, reject) {
        logger.log(chalk.cyan(`正在下载模版，请稍候......`));

        download(`direct:${url}`, tmpdir, { clone: true, checkout: false, stdio: ["inherit", "inherit", "inherit"] }, (err) => {
            if (err) {
                logger.log(chalk.red(`模版下载失败！`));
                reject(err);
            } else {
                logger.log(chalk.green(`模版下载成功！`));
                resolve(tmpdir);
            }
        });
    })
}