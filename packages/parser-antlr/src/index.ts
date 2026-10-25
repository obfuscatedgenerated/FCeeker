import {build_codepoint_offset_table, type ParseError, type Parser} from "@fceeker/core";
import type {FormulaNode} from "@fceeker/ast";

import {
    ATNSimulator,
    BaseErrorListener,
    CharStream,
    CommonTokenStream,
    RecognitionException,
    Recognizer,
    type Token
} from "antlr4ng";

import {FCRegToASTVisitor} from "./visitor";
import {FCRegLexer} from "./grammar/generated/FCRegLexer";
import {FCRegParser} from "./grammar/generated/FCRegParser";

class CustomErrorListener extends BaseErrorListener {
    readonly #errors: ParseError[] = [];
    readonly #codepoint_offsets: number[];

    constructor(codepoint_offsets: number[]) {
        super();
        this.#codepoint_offsets = codepoint_offsets;
    }

    override syntaxError<S extends Token, T extends ATNSimulator>(recognizer: Recognizer<T>, offendingSymbol: S | null, line: number, column: number, msg: string, e: RecognitionException | null) {
        if (!offendingSymbol) {
            this.#errors.push({
                message: msg,
                kind: "lexical",
                span: {
                    start: this.#codepoint_offsets[recognizer.inputStream!.index]!,
                    end: this.#codepoint_offsets[recognizer.inputStream!.index + 1] ?? this.#codepoint_offsets.at(-1)!,
                }
            });
        } else {
            this.#errors.push({
                message: msg,
                kind: "syntax",
                span: {
                    start: this.#codepoint_offsets[offendingSymbol.start]!,
                    end: this.#codepoint_offsets[offendingSymbol.stop + 1] ?? this.#codepoint_offsets.at(-1)!,
                }
            });
        }
    }

    get errors() {
        return this.#errors;
    }
}

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
