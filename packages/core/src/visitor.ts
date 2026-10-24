import {FCRegVisitor} from "./grammar/generated/FCRegVisitor";
import type {ASTNode, Span, VariableNode} from "./ast";
import {ParserRuleContext} from "antlr4ng";
import type {VariableContext} from "./grammar/generated/FCRegParser";

export class FCRegToASTVisitor extends FCRegVisitor<ASTNode> {
    readonly #codepoint_offsets: number[];

    // antlr gives its spans in codepoints, but utf-16 offsets are what javascript uses, so build a table to convert
    #build_codepoint_offset_table = (text: string): number[] => {
        const codepoint_offsets: number[] = [];
        let offset = 0;

        for (const codepoint of text) {
            codepoint_offsets.push(offset);
            offset += codepoint.length;
        }

        codepoint_offsets.push(offset);

        return codepoint_offsets;
    }

    constructor(source: string) {
        super();
        this.#codepoint_offsets = this.#build_codepoint_offset_table(source);
    }

    // then the offset table can be used to get the ast node span (which is in utf-16 char offsets)
    #get_span = (ctx: ParserRuleContext): Span => {
        if (!ctx.start || !ctx.stop) {
            throw new Error("Missing span");
        }

        return {
            start: this.#codepoint_offsets[ctx.start.start]!,
            end: this.#codepoint_offsets[ctx.stop.stop + 1]!
        }
    }

    override visitVariable = (ctx: VariableContext): VariableNode => {
        if (ctx.VARNAME()) {
            return {
                type: "NamedVariable",
                name: ctx.getText(),
                span: this.#get_span(ctx)
            }
        } else if (ctx.UNIVERSE_VAR()) {
            return {
                type: "UniverseVariable",
                span: this.#get_span(ctx)
            };
        } else {
            throw new Error("Unrecognised variable token");
        }
    }
}
