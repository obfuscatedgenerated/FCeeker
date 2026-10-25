import parse from "@fceeker/parser-antlr";
import {collect_free_variables, satisfies} from "@fceeker/core";

import * as fs from "node:fs";
import * as console from "node:console";
import * as readline from "node:readline/promises";

const input_path = process.argv[2];

if (!input_path) {
    console.error("No input path!");
    process.exit(1);
}

const input_word = process.argv[3];

if (!input_word) {
    console.error("No input word!");
    process.exit(1);
}

let contents = fs.readFileSync(input_path, {encoding: "utf-8"});
if (contents[0] === "\uFEFF") {
    // strip leading bom
    contents = contents.slice(1);
}

const parsed = parse(contents);

if (!parsed.success) {
    for (const error of parsed.errors) {
        console.error(`- ${error.kind}: ${error.message}${error.span ? ` (indices ${error.span?.start}-${error.span?.end})` : ""}`);
    }
    process.exit(1);
}

const free_vars = collect_free_variables(parsed.ast);

if (free_vars.size === 0) {
    console.log("No free variables.");
    process.exit(0);
}

const reader = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const ask_for_factor = async (var_name: string) => {
    while (true) {
        const value = await reader.question(`${var_name} = `);
        if (!input_word.includes(value)) {
            console.error(`${value} is not a factor of ${input_word}`);
        } else {
            return value;
        }
    }
}

const ask_for_assignments = async () => {
    const assignments = new Map<string, string>();

    for (const free_var of free_vars) {
        assignments.set(free_var, await ask_for_factor(free_var));
    }

    return assignments;
}

ask_for_assignments().then((assignments) => {
    const result = satisfies(parsed.ast, input_word, assignments, true);
    console.log(result);

    process.exit(0);
});
