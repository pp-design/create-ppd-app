#!/usr/bin/env node

const { Command } = require("commander");
const program = new Command();

const createApp = require("./../")

program
    .argument('<project-name>', '项目名')
    .description("创建新项目")
    .action(createApp);

program.parse(process.argv);