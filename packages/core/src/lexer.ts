import type {ParseError} from "./parser";
import type {Span} from "@fceeker/ast";

export type TokenName =
    "negation" |
    "conjunction" |
    "disjunction" |
    "in_constraint" |
    "regular_expression" |
    "universal" |
    "existential" |
    "universe_var" |
    "equals" |
    "left_bracket" |
    "right_bracket" |
    "comma" |
    "colon" |
    "empty" |
    "string" |
    "varname";

export interface Token {
    name: TokenName;
    value: string;
    span: Span;
}

export interface LexResult {
    tokens: Token[];
    errors: ParseError[];
}

export type Lexer = (text: string) => LexResult;
