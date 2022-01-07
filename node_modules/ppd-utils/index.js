exports.rm = require("rimraf");
exports.fs = require("fs-extra");
exports.ora = require("ora");
exports.chalk = require("chalk");
exports.execa = require("execa");

exports.merge = require("./lib/merge");
exports.type = require("./lib/type");
exports.file = require("./lib/file");
exports.logger = require("./lib/logger");
exports.generator = require("./lib/generator");
exports.utils = require("./lib/utils");
exports.version = require("./lib/version");