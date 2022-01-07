const { utils, execa } = require("ppd-utils");

function executeCommand(command, args, targetDir) {
    return new Promise((resolve, reject) => {
        const child = execa(command, args, { cwd: targetDir, stdio: ["inherit", "inherit", "inherit"] })
            .then((info) => {
                resolve();
            })
            .catch(err => {
                reject(`command failed: ${command} ${args.join(" ")}`);
            });
    })
}

module.exports = async function (targetDir, command) {
    let args = [];
    if (!command) {
        const hasYarn = await utils.hasCommand("yarnpkg");
        if (hasYarn) {
            command = "yarn";
        } else {
            command = "npm";
        }
    }
    if (command !== "yarn") {
        args = ["install", "--loglevel", "error"];
    }
    await executeCommand(command, args, targetDir);
};