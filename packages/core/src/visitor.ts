import {FCRegVisitor} from "./grammar/generated/FCRegVisitor";
import type {
    ASTNode,
    Pattern,
    RegularConstraintNode,
    Span,
    StringLiteralNode,
    VariableNode,
    WordEquationNode
} from "./ast";
import {type ParserRuleContext, TerminalNode} from "antlr4ng";
import {
    FCRegParser,
    type PatternContext,
    RegularConstraintContext,
    VariableContext,
    WordEquationContext
} from "./grammar/generated/FCRegParser";

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
    #get_span = (ctx: ParserRuleContext | TerminalNode): Span => {
        if (ctx instanceof TerminalNode) {
            return {
                start: this.#codepoint_offsets[ctx.symbol.start]!,
                end: this.#codepoint_offsets[ctx.symbol.stop + 1]!,
            }
        }

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

    #unescape_string = (str: string): string => {
        return str
            .substring(1, str.length - 1)
            .replace(/\\./g, (substr) => {
                // replace the defined escapes as a single regex based pass so they don't interfere
                switch (substr.substring(1)) {
                    case "n":
                        return "\n"
                    case "r":
                        return "\r"
                    case "\"":
                        return "\""
                    case "\\":
                        return "\\"
                    default:
                        return substr
                }
            })
    }

    #read_pattern = (ctx: PatternContext): Pattern => {
        const pattern: Pattern = [];

        for (const child of ctx.children) {
            if (child instanceof VariableContext) {
                pattern.push(this.visitVariable(child));
            } else if (child instanceof TerminalNode) {
                if (child.symbol.type === FCRegParser.EMPTY) {
                    // normalise empty word symbols to empty string literals
                    pattern.push({
                        type: "StringLiteral",
                        value: "",
                        span: this.#get_span(child)
                    });
                } else if (child.symbol.type === FCRegParser.STRING) {
                    pattern.push({
                        type: "StringLiteral",
                        value: this.#unescape_string(child.getText()),
                        span: this.#get_span(child)
                    });
                } else {
                    throw new Error(`Unexpected terminal of type ${FCRegParser.symbolicNames[child.symbol.type]} passed to pattern`);
                }
            } else {
                throw new Error("Unexpected pattern child type");
            }
        }

        return pattern;
    }

    override visitWordEquation = (ctx: WordEquationContext): WordEquationNode => {
        return {
            type: "WordEquation",
            variable: this.visitVariable(ctx.variable()),
            pattern: this.#read_pattern(ctx.pattern()),
            span: this.#get_span(ctx)
        }
    }

    #unescape_regex = (regex: string): string => {
        return regex
            .substring(1, regex.length - 1)
            .replaceAll("\/", "/")
    }

    override visitRegularConstraint = (ctx: RegularConstraintContext): RegularConstraintNode => {
        return {
            type: "RegularConstraint",
            variable: this.visitVariable(ctx.variable()),
            regex: this.#unescape_regex(ctx.REGULAR_EXPRESSION().getText()),
            span: this.#get_span(ctx)
        }
    }
}
