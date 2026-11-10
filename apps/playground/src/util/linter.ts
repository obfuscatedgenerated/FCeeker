import {type Diagnostic, linter} from "@codemirror/lint";
import {parse_fc} from "./runner.ts";

export const fc_linter = linter(view => {
    const parsed = parse_fc(view.state.doc.toString());
    if (!parsed.success) {
        return parsed.errors.map(e => ({
            from: e.span.start,
            to: e.span.end,
            severity: "error",
            message: `${e.kind}: ${e.message}`
        } satisfies Diagnostic));
    }

    return [];
});
