#! /usr/bin/env bun
import { Command } from "commander";
import packageJSON from "../package.json";
import user from "./commands/user";

const program = new Command();
program
	.name(packageJSON.name)
	.description(packageJSON.description)
	.version(packageJSON.version);

user(program);

program.showHelpAfterError();

program.parse(process.argv);
