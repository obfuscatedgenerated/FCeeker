import {type Parser, type Lexer, type Token, type TokenName} from "@fceeker/core";
import type {FormulaNode} from "@fceeker/ast";

import {CommonTokenStream} from "antlr4ng";

import {FCRegParser} from "./grammar/generated/FCRegParser";

import {FCRegToASTVisitor, VisitorSyntaxError} from "./visitor";
import {convert_token, create_lexer} from "./lexer";

export default ((text) => {
    const {lexer, error_listener, codepoint_offsets} = create_lexer(text);

    const tokens = new CommonTokenStream(lexer);

    const parser = new FCRegParser(tokens);
    parser.removeErrorListeners();
    parser.addErrorListener(error_listener);

    const tree = parser.query();

    if (error_listener.errors.length !== 0) {
        return {
            success: false,
            errors: error_listener.errors
        }
    }

    const ast_visitor = new FCRegToASTVisitor(codepoint_offsets);
    let output_ast: FormulaNode;

    try {
        output_ast = ast_visitor.visitQuery(tree);
    } catch (e) {
        return {
            success: false,
            errors: [{
                kind: (e instanceof VisitorSyntaxError) ? "syntax" : "transform",
                message: (e instanceof Error) ? e.message : String(e)
            }]
        };
    }

    return {
        success: true,
        ast: output_ast
    };
}) satisfies Parser;

export const lex: Lexer = (text: string) => {
    const {lexer, error_listener, codepoint_offsets} = create_lexer(text);

    const antlr_tokens = lexer.getAllTokens();
    const tokens = antlr_tokens.map(token => convert_token(token, codepoint_offsets)).filter((token): token is Token => token !== null);

    return {
        tokens,
        errors: error_listener.errors
    };
}
