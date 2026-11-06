import type {FormulaNode, Span} from "@fceeker/ast";

export interface ParseError {
    message: string;
    kind: "lexical" | "syntax" | "transform";
    span?: Span;
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
