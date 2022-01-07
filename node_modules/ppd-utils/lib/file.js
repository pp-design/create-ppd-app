const fs = require("fs-extra");
const path = require("path");
const { isArray } = require("./type");

const cwd = process.cwd();

function isExtname(file, extname) {
    if (!extname) {
        throw `请输入正确的扩展名`;
    }
    let type = path.extname(file);
    if (type) {
        if (isArray(extname)) {
            return extname.indexOf(type) >= 0;
        } else if (type === extname) {
            return true;
        }
    }
    return false;
}

function modifyExtname(file, extname) {
    let type = path.extname(file);
    if (type && extname && type !== extname) {
        let index = file.lastIndexOf(".");
        if (index >= 0) {
            return file.substring(0, index) + extname;
        }
    }
    return file;
}

function getFileName(file) {
    let type = path.extname(file);
    if (type) {
        const index = file.indexOf(type);
        return file.substring(0, index);
    }
    return file;
}

async function readdirSync(target, filter, files) {
    if (!path.isAbsolute(target)) {
        target = path.normalize(path.join(cwd, target));
    }
    files = files || [];
    filter = filter || noDotFiles;
    if (fs.existsSync(target)) {
        fs.readdirSync(target)
            .filter(function (file, index) {
                return filter(file, index, target);
            })
            .forEach((file) => {
                const filePath = path.join(target, file);
                const stat = fs.statSync(filePath);
                const isDirectory = stat && stat.isDirectory();
                if (isDirectory) {
                    readdirSync(filePath, filter, files);
                } else {
                    files.push(filePath);
                }
            })
    }
    return files;
}

function noDotFiles(x) {
    return x[0] !== ".";
}

exports.isExtname = isExtname;
exports.getFileName = getFileName;
exports.modifyExtname = modifyExtname;
exports.readdirSync = readdirSync;