import parse from "@fceeker/parser-antlr";
import {execute} from "@fceeker/core";

import * as fs from "node:fs";
import * as console from "node:console";
import * as process from "node:process";

import ProgressBar from "progress";

const fc_file_path = process.argv[2];

if (!fc_file_path) {
    console.error("No FC file path!");
    process.exit(1);
}

const input_word_path = process.argv[3];

if (!input_word_path) {
    console.error("No input word path!");
    process.exit(1);
}

let fc_contents = fs.readFileSync(fc_file_path, {encoding: "utf-8"});
if (fc_contents[0] === "\uFEFF") {
    // strip leading bom
    fc_contents = fc_contents.slice(1);
}

let input_word = fs.readFileSync(input_word_path, {encoding: "utf-8"});
if (input_word[0] === "\uFEFF") {
    input_word = input_word.slice(1);
}

const parsed = parse(fc_contents);

if (!parsed.success) {
    for (const error of parsed.errors) {
        console.error(`- ${error.kind}: ${error.message}${error.span ? ` (indices ${error.span?.start}-${error.span?.end})` : ""}`);
    }
    process.exit(1);
}

let bar: ProgressBar | null = null;
let found = 0;
const output = execute(parsed.ast, input_word, {
    progress_start: (total) => {
        bar = new ProgressBar("Working: [:bar] :current/:total assignments (:percent, :rate per second) - Found :found satisfying assignments.", {total})
        bar.tick({found: 0});
    },
    progress_tick: (count) => bar && bar.tick(count),
    on_found: () => bar && bar.tick({found: ++found})
});

console.log("\n");

for (const warning of output.warnings) {
    console.warn(warning);
}

if (output.type === "error") {
    console.error(output.message);
    process.exit(1);
} else if (output.type === "boolean") {
    console.log(output.result);
} else {
    const satisfy_count = output.result.size;

    if (satisfy_count === 0) {
        console.log("No satisfying assignments");
        process.exit(0);
    }

    console.log(`Finished with ${satisfy_count} satisfying assignment${satisfy_count === 1 ? "" : "s"}:`);

    const result_objs = [] as Record<string, string>[];
    for (const assignment of output.result) {
        result_objs.push(Object.fromEntries(assignment.entries()));
    }

    console.table(result_objs);
}
