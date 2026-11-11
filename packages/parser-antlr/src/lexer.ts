import {CharStream, type Token as ANTLRToken} from "antlr4ng";
import {build_codepoint_offset_table, type Token, type TokenName} from "@fceeker/core";
import {CustomErrorListener} from "./error_listener";
import {FCRegLexer} from "./grammar/generated/FCRegLexer";

export const create_lexer = (text: string) => {
    const codepoint_offsets = build_codepoint_offset_table(text);
    const chars = CharStream.fromString(text);

    const error_listener = new CustomErrorListener(codepoint_offsets);

    const lexer = new FCRegLexer(chars);
    lexer.removeErrorListeners();
    lexer.addErrorListener(error_listener);

    return {
        lexer,
        chars,
        codepoint_offsets,
        error_listener
    };
}

export const convert_token = (token: ANTLRToken, codepoint_offsets: number[]): Token | null => {
    let name: TokenName | null = null;

    switch (token.type) {
        case FCRegLexer.NEGATION:
            name = "negation";
            break;
        case FCRegLexer.CONJUNCTION:
            name = "conjunction";
            break;
        case FCRegLexer.DISJUNCTION:
            name = "disjunction";
            break;
        case FCRegLexer.IN_CONSTRAINT:
            name = "in_constraint";
            break;
        case FCRegLexer.REGULAR_EXPRESSION:
            name = "regular_expression";
            break;
        case FCRegLexer.UNIVERSAL:
            name = "universal";
            break;
        case FCRegLexer.EXISTENTIAL:
            name = "existential";
            break;
        case FCRegLexer.UNIVERSE_VAR:
            name = "universe_var";
            break;
        case FCRegLexer.EQUALS:
            name = "equals";
            break;
        case FCRegLexer.LEFT_BRACKET:
            name = "left_bracket";
            break;
        case FCRegLexer.RIGHT_BRACKET:
            name = "right_bracket";
            break;
        case FCRegLexer.COMMA:
            name = "comma";
            break;
        case FCRegLexer.COLON:
            name = "colon";
            break;
        case FCRegLexer.EMPTY:
            name = "empty";
            break;
        case FCRegLexer.STRING:
            name = "string";
            break;
        case FCRegLexer.VARNAME:
            name = "varname";
            break;
    }

    if (name === null) {
        return null;
    }

    return {
        name,
        value: token.text!,
        span: {
            start: codepoint_offsets[token.start]!,
            end: codepoint_offsets[token.stop + 1] ?? codepoint_offsets.at(-1)!
        }
    };
}
