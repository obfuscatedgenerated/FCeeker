
import { AbstractParseTreeVisitor } from "antlr4ng";


import { QueryContext } from "./FCRegParser.js";
import { AtomicContext } from "./FCRegParser.js";
import { NegationContext } from "./FCRegParser.js";
import { QuantificationContext } from "./FCRegParser.js";
import { SubformulaContext } from "./FCRegParser.js";
import { ConjunctionContext } from "./FCRegParser.js";
import { DisjunctionContext } from "./FCRegParser.js";
import { QuantifierContext } from "./FCRegParser.js";
import { VarListContext } from "./FCRegParser.js";
import { AtomContext } from "./FCRegParser.js";
import { WordEquationContext } from "./FCRegParser.js";
import { RegularConstraintContext } from "./FCRegParser.js";
import { PatternContext } from "./FCRegParser.js";
import { VariableContext } from "./FCRegParser.js";


/**
 * This interface defines a complete generic visitor for a parse tree produced
 * by `FCRegParser`.
 *
 * @param <Result> The return type of the visit operation. Use `void` for
 * operations with no return type.
 */
export class FCRegVisitor<Result> extends AbstractParseTreeVisitor<Result> {
    /**
     * Visit a parse tree produced by `FCRegParser.query`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitQuery?: (ctx: QueryContext) => Result;
    /**
     * Visit a parse tree produced by the `Atomic`
     * labeled alternative in `FCRegParser.formula`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitAtomic?: (ctx: AtomicContext) => Result;
    /**
     * Visit a parse tree produced by the `Negation`
     * labeled alternative in `FCRegParser.formula`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitNegation?: (ctx: NegationContext) => Result;
    /**
     * Visit a parse tree produced by the `Quantification`
     * labeled alternative in `FCRegParser.formula`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitQuantification?: (ctx: QuantificationContext) => Result;
    /**
     * Visit a parse tree produced by the `Subformula`
     * labeled alternative in `FCRegParser.formula`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitSubformula?: (ctx: SubformulaContext) => Result;
    /**
     * Visit a parse tree produced by the `Conjunction`
     * labeled alternative in `FCRegParser.formula`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitConjunction?: (ctx: ConjunctionContext) => Result;
    /**
     * Visit a parse tree produced by the `Disjunction`
     * labeled alternative in `FCRegParser.formula`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitDisjunction?: (ctx: DisjunctionContext) => Result;
    /**
     * Visit a parse tree produced by `FCRegParser.quantifier`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitQuantifier?: (ctx: QuantifierContext) => Result;
    /**
     * Visit a parse tree produced by `FCRegParser.varList`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitVarList?: (ctx: VarListContext) => Result;
    /**
     * Visit a parse tree produced by `FCRegParser.atom`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitAtom?: (ctx: AtomContext) => Result;
    /**
     * Visit a parse tree produced by `FCRegParser.wordEquation`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitWordEquation?: (ctx: WordEquationContext) => Result;
    /**
     * Visit a parse tree produced by `FCRegParser.regularConstraint`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitRegularConstraint?: (ctx: RegularConstraintContext) => Result;
    /**
     * Visit a parse tree produced by `FCRegParser.pattern`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitPattern?: (ctx: PatternContext) => Result;
    /**
     * Visit a parse tree produced by `FCRegParser.variable`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitVariable?: (ctx: VariableContext) => Result;
}

