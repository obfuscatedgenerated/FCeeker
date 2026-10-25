import type {FormulaNode, Span} from "@fceeker/ast";

export interface ParseError {
    message: string;
    kind: "lexical" | "syntax" | "transform";
    span?: Span;
}

// antlr gives its spans in codepoints, but utf-16 offsets are what javascript uses, so build a table to convert
export const build_codepoint_offset_table = (text: string): number[] => {
    const codepoint_offsets: number[] = [];
    let offset = 0;

    for (const codepoint of text) {
        codepoint_offsets.push(offset);
        offset += codepoint.length;
    }

    codepoint_offsets.push(offset);

    return codepoint_offsets;
}

export interface SuccessfulParse {
    success: true;
    ast: FormulaNode;
}

export interface UnsuccessfulParse {
    success: false;
    errors: ParseError[];
}

export type ParseResult = SuccessfulParse | UnsuccessfulParse;

export type Parser = (text: string) => ParseResult;
