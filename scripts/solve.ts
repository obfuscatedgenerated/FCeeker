import parse from "@fceeker/parser-antlr";
import {execute} from "@fceeker/core";

import * as fs from "node:fs";
import * as console from "node:console";
import * as process from "node:process";

import ProgressBar from "progress";

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

let bar: ProgressBar | null = null;
const output = execute(parsed.ast, input_word, {
    progress_start: (total) => bar = new ProgressBar("Working: [:bar] :current/:total assignments (:percent)", {total}),
    progress_tick: (count) => bar && bar.tick(count)
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
