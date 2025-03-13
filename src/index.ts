#! /usr/bin/env bun
import { Command } from "commander";
import packageJSON from "../package.json";
import user from "./commands/user";
import serve from "./commands/serve";
import simulate from "./commands/simulate";
import rolls from "./commands/rolls";

const program = new Command();
program
	.name(packageJSON.name)
	.description(packageJSON.description)
	.version(packageJSON.version);

user(program);
serve(program);
simulate(program);
rolls(program);

program.showHelpAfterError();

program.parse(process.argv);
