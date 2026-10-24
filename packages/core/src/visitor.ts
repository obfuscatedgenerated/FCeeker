import {FCRegVisitor} from "./grammar/generated/FCRegVisitor";
import type {
    ASTNode, AtomNode, ConjunctionNode, DisjunctionNode, FormulaNode, NamedVariableNode, NegationNode,
    Pattern, QuantificationNode,
    RegularConstraintNode,
    Span, StringLiteralNode,
    VariableNode,
    WordEquationNode
} from "./ast";
import {type ParserRuleContext, TerminalNode} from "antlr4ng";
import type {
    AtomContext, AtomicContext, ConjunctionContext, DisjunctionContext,
    FormulaContext, NegationContext,
    PatternContext, QuantificationContext, QueryContext,
    RegularConstraintContext, SubformulaContext,
    VarListContext,
    WordEquationContext
} from "./grammar/generated/FCRegParser";
import {FCRegParser, VariableContext} from "./grammar/generated/FCRegParser";

export class FCRegToASTVisitor extends FCRegVisitor<ASTNode> {
    readonly #codepoint_offsets: number[];

    constructor(codepoint_offsets: number[]) {
        super();
        this.#codepoint_offsets = codepoint_offsets;
    }

    // then the offset table can be used to get the ast node span (which is in utf-16 char offsets)
    #get_span = (ctx: ParserRuleContext | TerminalNode): Span => {
        if (ctx instanceof TerminalNode) {
            return {
                start: this.#codepoint_offsets[ctx.symbol.start]!,
                end: this.#codepoint_offsets[ctx.symbol.stop + 1]!,
            };
        }

        if (!ctx.start || !ctx.stop) {
            throw new Error("Missing span");
        }

        return {
            start: this.#codepoint_offsets[ctx.start.start]!,
            end: this.#codepoint_offsets[ctx.stop.stop + 1]!
        };
    }

    override visitVariable = (ctx: VariableContext): VariableNode => {
        if (ctx.VARNAME()) {
            return {
                type: "NamedVariable",
                name: ctx.getText(),
                span: this.#get_span(ctx)
            };
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
            });
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
                    } satisfies StringLiteralNode);
                } else if (child.symbol.type === FCRegParser.STRING) {
                    pattern.push({
                        type: "StringLiteral",
                        value: this.#unescape_string(child.getText()),
                        span: this.#get_span(child)
                    } satisfies StringLiteralNode);
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
        };
    }

    #unescape_regex = (regex: string): string => {
        return regex
            .substring(1, regex.length - 1)
            .replaceAll("\\/", "/");
    }

    override visitRegularConstraint = (ctx: RegularConstraintContext): RegularConstraintNode => {
        return {
            type: "RegularConstraint",
            variable: this.visitVariable(ctx.variable()),
            regex: this.#unescape_regex(ctx.REGULAR_EXPRESSION().getText()),
            span: this.#get_span(ctx)
        };
    }

    override visitAtom = (ctx: AtomContext): AtomNode => {
        if (ctx.wordEquation()) {
            return this.visitWordEquation(ctx.wordEquation()!);
        } else if (ctx.regularConstraint()) {
            return this.visitRegularConstraint(ctx.regularConstraint()!);
        } else {
            throw new Error("Unrecognised atom");
        }
    }

    override visitAtomic = (ctx: AtomicContext): AtomNode => {
        return this.visitAtom(ctx.atom());
    }

    #visit_formula = (ctx: FormulaContext): FormulaNode => {
        const result = this.visit(ctx);
        if (!result) {
            throw new Error("No formula");
        }

        return result as FormulaNode;
    }

    override visitSubformula = (ctx: SubformulaContext): FormulaNode => {
        return this.#visit_formula(ctx.formula());
    }

    override visitNegation = (ctx: NegationContext): NegationNode => {
        return {
            type: "Negation",
            formula: this.#visit_formula(ctx.formula()),
            span: this.#get_span(ctx)
        };
    }

    override visitConjunction = (ctx: ConjunctionContext): ConjunctionNode => {
        const subformulae = ctx.formula().map(this.#visit_formula);
        const flattened: FormulaNode[] = [];

        for (const formula of subformulae) {
            if (formula.type === "Conjunction") {
                // flatten conjunctions on each recursion so it becomes a single n-ary conjunction
                flattened.push(...formula.formulae);
            } else {
                flattened.push(formula);
            }
        }

        return {
            type: "Conjunction",
            formulae: flattened,
            span: this.#get_span(ctx)
        };
    }

    override visitDisjunction = (ctx: DisjunctionContext): DisjunctionNode => {
        const subformulae = ctx.formula().map(this.#visit_formula);
        const flattened: FormulaNode[] = [];

        for (const formula of subformulae) {
            if (formula.type === "Disjunction") {
                // flatten disjunctions on each recursion so it becomes a single n-ary disjunction
                flattened.push(...formula.formulae);
            } else {
                flattened.push(formula);
            }
        }

        return {
            type: "Disjunction",
            formulae: flattened,
            span: this.#get_span(ctx)
        };
    }

    #read_var_list = (ctx: VarListContext): NamedVariableNode[] => {
        const variables: NamedVariableNode[] = [];

        for (const child of ctx.children) {
            if (!(child instanceof TerminalNode)) {
                throw new Error("Expected only terminals to be children of a var list");
            }

            if (child.symbol.type === FCRegParser.VARNAME) {
                variables.push({
                    type: "NamedVariable",
                    name: child.getText(),
                    span: this.#get_span(child)
                });
            } else if (child.symbol.type === FCRegParser.COMMA) {
                // silently skip
            } else {
                throw new Error(`Unexpected terminal of type ${FCRegParser.symbolicNames[child.symbol.type]} passed to var list`);
            }
        }

        return variables;
    }

    override visitQuantification = (ctx: QuantificationContext): QuantificationNode => {
        const quantifier = ctx.quantifier();

        let type: "UniversalQuantification" | "ExistentialQuantification";
        if (quantifier.UNIVERSAL()) {
            type = "UniversalQuantification";
        } else if (quantifier.EXISTENTIAL()) {
            type = "ExistentialQuantification";
        } else {
            throw new Error("Unexpected quantifier type");
        }

        return {
            type,
            formula: this.#visit_formula(ctx.formula()),
            variables: this.#read_var_list(ctx.varList()),
            span: this.#get_span(ctx)
        };
    }

    override visitQuery = (ctx: QueryContext): FormulaNode => {
        return this.#visit_formula(ctx.formula());
    }
}
