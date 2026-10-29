import parse from "@fceeker/parser-antlr";
import {collect_free_variables, factorise, generate_assignments, satisfies} from "@fceeker/core";

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

// TODO: will need to evaluate assignments for quantifiers once implemented

const free_vars = collect_free_variables(parsed.ast);

const factors = factorise(input_word);
const assignment_gen = generate_assignments(Array.from(free_vars), factors);

let satisfy_count = 0;
for (const assignments of assignment_gen) {
    const result = satisfies(parsed.ast, {
        word: input_word,
        assignments,
        skip_factor_check: true
    });

    if (result) {
        console.log(assignments);
        satisfy_count++;
    }
}

console.log(`Finished with ${satisfy_count} satisfying assignment${satisfy_count === 1 ? "" : "s"}`);
