const path = require("path");
const { fs, file: File } = require("ppd-utils");

let defaultIgnores = [
    ".gitignore",
    "theme.config.js",
    "public/assets/data"
];

async function readIgnores(targetDir) {
    let ignores = [];
    let ignorePath = path.join(targetDir, ".ppdignore");
    if (fs.pathExistsSync(ignorePath)) {
        const contents = fs.readFileSync(ignorePath, "utf-8");
        const configIgnores = contents ? contents.split(/[\s\n]/) : [];
        ignores = configIgnores.filter(value => {
            return value && !defaultIgnores.includes(value);
        });
    }
    ignores = defaultIgnores.concat(ignores);
    let ignoreName = "";
    let ignoresResult = [];
    let len = ignores.length;
    for (let i = 0; i < len; i++) {
        ignorePath = path.join(targetDir, ignores[i]);
        if (fs.pathExistsSync(ignorePath)) {
            const stat = fs.statSync(ignorePath);
            if (stat && stat.isDirectory()) {
                const files = await File.readdirSync(ignorePath);
                files.forEach(file => {
                    ignoreName = path.basename(file);
                    if (ignoresResult.indexOf(ignoreName) < 0) {
                        ignoresResult.push(ignoreName);
                    }
                });
            } else {
                ignoreName = path.basename(ignorePath);
                if (ignoresResult.indexOf(ignoreName) < 0) {
                    ignoresResult.push(ignoreName);
                }
            }
        }
    }
    return ignoresResult;
}
module.exports = (targetDir) => {
    return readIgnores(targetDir);
};