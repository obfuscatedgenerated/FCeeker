import {build_codepoint_offset_table, type Parser} from "@fceeker/core";
import type {FormulaNode} from "@fceeker/ast";

import {CharStream, CommonTokenStream} from "antlr4ng";

import {FCRegLexer} from "./grammar/generated/FCRegLexer";
import {FCRegParser} from "./grammar/generated/FCRegParser";

import {FCRegToASTVisitor} from "./visitor";
import {CustomErrorListener} from "./error_listener";

export default ((text) => {
    const codepoint_offsets = build_codepoint_offset_table(text);
    const chars = CharStream.fromString(text);

    const error_listener = new CustomErrorListener(codepoint_offsets);

    const lexer = new FCRegLexer(chars);
    lexer.removeErrorListeners();
    lexer.addErrorListener(error_listener);

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
                kind: "transform",
                message: (e instanceof Error) ? e.message : String(e)
            }]
        };
    }

    return {
        success: true,
        ast: output_ast
    };
}) satisfies Parser;
