import {ATNSimulator, BaseErrorListener, RecognitionException, Recognizer, type Token} from "antlr4ng";
import type {ParseError} from "@fceeker/core";

export class CustomErrorListener extends BaseErrorListener {
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
