const { utils } = require("ppd-utils");

async function getCommands() {
    const commands = [];
    const hasYarn = await utils.hasCommand("yarnpkg");
    if (hasYarn) {
        commands.push({
            name: "Use Yarn",
            value: "yarn",
            short: "Yarn"
        });
    }
    commands.push({
        name: "Use NPM",
        value: "npm",
        short: "Npm"
    });
    return commands;
}

module.exports = () => {
    return getCommands();
};