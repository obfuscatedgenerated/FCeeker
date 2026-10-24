import {parse} from "@fceeker/core";
import * as console from "node:console";
import * as process from "node:process";

const input = process.argv.slice(2).join(" ");
if (!input) {
    console.error("No input!");
    process.exit(1);
}

const result = parse(input);

if (!result.success) {
    for (const error of result.errors) {
        console.error(`- ${error.kind}: ${error.message}${error.span ? ` (indices ${error.span?.start}-${error.span?.end})` : ""}`);
    }
    process.exit(1);
}

console.dir(result.ast, { depth: null });
