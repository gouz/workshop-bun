# workshop-bun
Create a CLI in 2h

## Requirements

Bun : https://bun.sh/

## What our application will do ?

CLI:
- `forge user add`: ask name => store db + display token
- `forge user delete`: select name + confirm
- `forge user list`: list of users
- `forge rolls`: stats of rolls for all user
- `forge rolls -u <username>`: stats of rolls for a specific user
- `forge serve`: launch the server for users
- `forge serve --port <number>`: launch the server for users with a specific port
- `forge simulate`: create a fake user and rolls a lot of dices

API:
- GET `/api/roll/:dice/:number`: roll a X dice of value
- GET `/api/user/:id/rolls`: list of last rolls
- POST `/api/user/:id/rolls`: add a roll to the user rolls list

## Ready?

All steps correspond to a branch if you are stuck, you can switch to a branch to have the result.

## Step 1: Initialisation

1. Create a new directory for your project and navigate into it.
2. Initialize a new Bun project by running `bun init`.
3. Choose `Blank`

## Step 2: Install Dependencies

```sh
bun add elysia commander @elysiajs/jwt @elysiajs/swagger chalk cli-progress @types/cli-progress @inquirer/prompts
```

- `elysia`: a lightweight framework for building APIs in Bun.
- `commander`: a command-line interface builder for Node.js / Bun.
- `@elysiajs/jwt`: an authentication middleware for Elysia.
- `@elysiajs/swagger`: a Swagger UI generator for Elysia.
- `chalk`: a library for styling text in the terminal.
- `cli-progress`: a progress bar library for the command line.
- `@types/cli-progress`: type definitions for cli-progress.
- `@inquirer/prompts`: a library for creating interactive prompts in the command line.

## Step 3: Create the structure of your project

Create the following directory structure:

- Move `index.ts` to `src/index.ts`
- Create `src/commands/user.ts`
- Create `src/commands/rolls.ts`
- Create `src/commands/serve.ts`
- Create `src/commands/simulate.ts`

In package.json:

- Change in `module`: `src/index.ts`
- Add `version`: `"0.0.1"`
- Add
```
"bin": {
  "forge": "./src/index.ts"
},
"scripts": {
    "forge": "bun src/index.ts"
}
```

## Step 4: Command and Conquer

In package.json:

- Add `"description": "A bun base CLI for a simple dice game",`

To start your main program, in `src/index.ts`, import and use the `Commander` library to create a CLI application.

```ts
#! /usr/bin/env bun
import { Command } from "commander";
import packageJSON from "../package.json";
const program = new Command();
program
	.name(packageJSON.name)
	.description(packageJSON.description)
	.version(packageJSON.version);
// here comes your commands

program.showHelpAfterError();
program.parse(process.argv);
```

And create your commands and subcommands using this template:

```ts
import type { Command } from "commander";
export default (program: Command) => {
	const myCMD = program
		.command("myCMD")
		.description("description of myCMD")
        .option("-s, --short <string>", "option description", "default value")
        .argument("<arg1>", "description of arg1")
		.action((arg1, options) => {});
	myCMD.command("mySub").action(() => {});
};
```

more information at https://github.com/tj/commander.js?tab=readme-ov-file#commanderjs

## Step 5: User

Our CLI has 3 subcommands:

- `forge user add`: ask name => store db + display token
- `forge user delete`: select name + confirm
- `forge user list`: list of users

To store users, we need a database. We will use SQLite for this purpose.

We will use the driver of Bun included: https://bun.sh/docs/api/sqlite

Then, create a `src/utils/db.ts` to manage the database.

```ts
import { Database } from "bun:sqlite";

const initDB = () => {
	const db = new Database(`${process.cwd()}/forge.db`, {
		create: true,
		strict: true,
	});

	db.run(`
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    token TEXT NOT NULL UNIQUE
)
    `);

	return db;
};

const db = initDB();
export default db;
```

And develop the subcommands.

The token is a uuid get from Bun.

```ts
randomUUIDv7();
```

## Step 6: Serve a page with a form to log in and display the dashboard to roll dices and API

Create a `.env` file with the following content:

```
MYSUPERSECRET=your_secret_key_here
```

Create a `src/utils/server.ts` to initialize the server thanks to Elysia and copy the content of `ressources/utils/server.ts`.

Add a table in your database following this schema:

```sql
CREATE TABLE IF NOT EXISTS rolls (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    dice INTEGER NOT NULL,
    value INTEGER NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id)  
)
```

Then copy the api files from `ressources/routes` to `src/routes`.

- `src/routes/index.ts`
- `src/routes/api/roll.ts`
- `src/routes/api/user.ts`
- `src/services/api/roll.ts`
- `src/services/api/user.ts`

And develop the services.

Tip for random number generation:

```ts
import { randomBytes } from "node:crypto";
export default (min: number, max: number) => {
	if (min > max) throw new Error("'min' must be less than 'max'");
	const buffer = randomBytes(
		Math.floor((max - min + 1) / Number.MAX_SAFE_INTEGER) + 1,
	);
	let result = min;
	for (const buf of buffer) {
		result += buf;
	}
	return (result % (max - min + 1)) + min;
};

```

Test your creation.

## Step 7: Simulation

In this step, we will use the lib "cli-progress" to display the progress of a simulation.

https://github.com/npkgz/cli-progress

For this step, we want to create a user "simulate" if not exists, and to roll each dice (4, 6, 8, 10, 12, 20, 100) 100000 times

Tip: to show the progression of the bar, use a sleep function between each roll with a timer of 1ms.

Example of output:

```
 ██████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ | dices | ETA: 1s | 1/7
 ███░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ | d4 | ETA: 134s | 7922/100000
```

## Step 8: Roll commands

CLI:
- `forge rolls`: stats of rolls for all user
- `forge rolls -u <username>`: stats of rolls for a specific user


## Step 9: Build to Share

```shell
bun build ./src/index.ts --outfile forge --compile
```

## Step Bonus 1: Swagger documentation for the API

Add a swagger documentation to the API.

https://elysiajs.com/plugins/swagger.html

## Step Bonus 2: Display charts into your terminal

TODO