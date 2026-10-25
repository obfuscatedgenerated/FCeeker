import {parse, collect_free_variables} from "@fceeker/core";

import * as fs from "fs";
import * as console from "node:console";

const input_path = process.argv[2];

if (!input_path) {
    console.error("No input path!");
    process.exit(1);
}

let contents = fs.readFileSync(input_path, {encoding: "utf-8"});
if (contents[0] === "\uFEFF") {
    // strip leading bom
    contents = contents.slice(1);
}

const result = parse(contents);

if (!result.success) {
    for (const error of result.errors) {
        console.error(`- ${error.kind}: ${error.message}${error.span ? ` (indices ${error.span?.start}-${error.span?.end})` : ""}`);
    }
    process.exit(1);
}

console.dir(result.ast, { depth: null });

const free_vars = collect_free_variables(result.ast);

if (free_vars.size === 0) {
    console.log("No free variables.");
} else {
    console.log("Free variables:");
    free_vars.forEach((var_name) => console.log(`- ${var_name}`));
}
