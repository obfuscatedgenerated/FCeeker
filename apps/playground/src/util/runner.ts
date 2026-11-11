import parse from "@fceeker/parser-antlr";

export const parse_fc = (fc_contents: string) => {
    const parsed = parse(fc_contents);

    if (!parsed.success) {
        for (const error of parsed.errors) {
            console.error(`- ${error.kind}: ${error.message}${error.span ? ` (indices ${error.span?.start}-${error.span?.end})` : ""}`);
        }
    }

    return parsed;
}
