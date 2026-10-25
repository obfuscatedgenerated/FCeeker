
import * as antlr from "antlr4ng";
import { Token } from "antlr4ng";

import { FCRegVisitor } from "./FCRegVisitor.js";

// for running tests with parameters, TODO: discuss strategy for typed parameters in CI
// eslint-disable-next-line no-unused-vars
type int = number;


export class FCRegParser extends antlr.Parser {
    public static readonly NEGATION = 1;
    public static readonly CONJUNCTION = 2;
    public static readonly DISJUNCTION = 3;
    public static readonly IN_CONSTRAINT = 4;
    public static readonly REGULAR_EXPRESSION = 5;
    public static readonly UNIVERSAL = 6;
    public static readonly EXISTENTIAL = 7;
    public static readonly UNIVERSE_VAR = 8;
    public static readonly EQUALS = 9;
    public static readonly LEFT_BRACKET = 10;
    public static readonly RIGHT_BRACKET = 11;
    public static readonly COMMA = 12;
    public static readonly COLON = 13;
    public static readonly EMPTY = 14;
    public static readonly STRING = 15;
    public static readonly VARNAME = 16;
    public static readonly WS = 17;
    public static readonly RULE_query = 0;
    public static readonly RULE_formula = 1;
    public static readonly RULE_quantifier = 2;
    public static readonly RULE_varList = 3;
    public static readonly RULE_atom = 4;
    public static readonly RULE_wordEquation = 5;
    public static readonly RULE_regularConstraint = 6;
    public static readonly RULE_pattern = 7;
    public static readonly RULE_variable = 8;

    public static readonly literalNames = [
        null, null, null, null, null, null, null, null, null, null, "'('", 
        "')'", "','", "':'"
    ];

    public static readonly symbolicNames = [
        null, "NEGATION", "CONJUNCTION", "DISJUNCTION", "IN_CONSTRAINT", 
        "REGULAR_EXPRESSION", "UNIVERSAL", "EXISTENTIAL", "UNIVERSE_VAR", 
        "EQUALS", "LEFT_BRACKET", "RIGHT_BRACKET", "COMMA", "COLON", "EMPTY", 
        "STRING", "VARNAME", "WS"
    ];
    public static readonly ruleNames = [
        "query", "formula", "quantifier", "varList", "atom", "wordEquation", 
        "regularConstraint", "pattern", "variable",
    ];

    public get grammarFileName(): string { return "FCReg.g4"; }
    public get literalNames(): (string | null)[] { return FCRegParser.literalNames; }
    public get symbolicNames(): (string | null)[] { return FCRegParser.symbolicNames; }
    public get ruleNames(): string[] { return FCRegParser.ruleNames; }
    public get serializedATN(): number[] { return FCRegParser._serializedATN; }

    protected createFailedPredicateException(predicate?: string, message?: string): antlr.FailedPredicateException {
        return new antlr.FailedPredicateException(this, predicate, message);
    }

    public constructor(input: antlr.TokenStream) {
        super(input);
        this.interpreter = new antlr.ParserATNSimulator(this, FCRegParser._ATN, FCRegParser.decisionsToDFA, new antlr.PredictionContextCache());
    }
    public query(): QueryContext {
        let localContext = new QueryContext(this.context, this.state);
        this.enterRule(localContext, 0, FCRegParser.RULE_query);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 18;
            this.formula(0);
            this.state = 19;
            this.match(FCRegParser.EOF);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }

    public formula(): FormulaContext;
    public formula(_p: number): FormulaContext;
    public formula(_p?: number): FormulaContext {
        if (_p === undefined) {
            _p = 0;
        }

        let parentContext = this.context;
        let parentState = this.state;
        let localContext = new FormulaContext(this.context, parentState);
        let previousContext = localContext;
        let _startState = 2;
        this.enterRecursionRule(localContext, 2, FCRegParser.RULE_formula, _p);
        try {
            let alternative: number;
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 34;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case FCRegParser.UNIVERSE_VAR:
            case FCRegParser.VARNAME:
                {
                localContext = new AtomicContext(localContext);
                this.context = localContext;
                previousContext = localContext;

                this.state = 22;
                this.atom();
                }
                break;
            case FCRegParser.NEGATION:
                {
                localContext = new NegationContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 23;
                this.match(FCRegParser.NEGATION);
                this.state = 24;
                this.formula(5);
                }
                break;
            case FCRegParser.UNIVERSAL:
            case FCRegParser.EXISTENTIAL:
                {
                localContext = new QuantificationContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 25;
                this.quantifier();
                this.state = 26;
                this.varList();
                this.state = 27;
                this.match(FCRegParser.COLON);
                this.state = 28;
                this.formula(2);
                }
                break;
            case FCRegParser.LEFT_BRACKET:
                {
                localContext = new SubformulaContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 30;
                this.match(FCRegParser.LEFT_BRACKET);
                this.state = 31;
                this.formula(0);
                this.state = 32;
                this.match(FCRegParser.RIGHT_BRACKET);
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
            this.context!.stop = this.tokenStream.LT(-1);
            this.state = 44;
            this.errorHandler.sync(this);
            alternative = this.interpreter.adaptivePredict(this.tokenStream, 2, this.context);
            while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                if (alternative === 1) {
                    if (this.parseListeners != null) {
                        this.triggerExitRuleEvent();
                    }
                    previousContext = localContext;
                    {
                    this.state = 42;
                    this.errorHandler.sync(this);
                    switch (this.interpreter.adaptivePredict(this.tokenStream, 1, this.context) ) {
                    case 1:
                        {
                        localContext = new ConjunctionContext(new FormulaContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, FCRegParser.RULE_formula);
                        this.state = 36;
                        if (!(this.precpred(this.context, 4))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 4)");
                        }
                        this.state = 37;
                        this.match(FCRegParser.CONJUNCTION);
                        this.state = 38;
                        this.formula(5);
                        }
                        break;
                    case 2:
                        {
                        localContext = new DisjunctionContext(new FormulaContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, FCRegParser.RULE_formula);
                        this.state = 39;
                        if (!(this.precpred(this.context, 3))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 3)");
                        }
                        this.state = 40;
                        this.match(FCRegParser.DISJUNCTION);
                        this.state = 41;
                        this.formula(4);
                        }
                        break;
                    }
                    }
                }
                this.state = 46;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 2, this.context);
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.unrollRecursionContexts(parentContext);
        }
        return localContext;
    }
    public quantifier(): QuantifierContext {
        let localContext = new QuantifierContext(this.context, this.state);
        this.enterRule(localContext, 4, FCRegParser.RULE_quantifier);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 47;
            _la = this.tokenStream.LA(1);
            if(!(_la === 6 || _la === 7)) {
            this.errorHandler.recoverInline(this);
            }
            else {
                this.errorHandler.reportMatch(this);
                this.consume();
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public varList(): VarListContext {
        let localContext = new VarListContext(this.context, this.state);
        this.enterRule(localContext, 6, FCRegParser.RULE_varList);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 49;
            this.match(FCRegParser.VARNAME);
            this.state = 54;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 12) {
                {
                {
                this.state = 50;
                this.match(FCRegParser.COMMA);
                this.state = 51;
                this.match(FCRegParser.VARNAME);
                }
                }
                this.state = 56;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public atom(): AtomContext {
        let localContext = new AtomContext(this.context, this.state);
        this.enterRule(localContext, 8, FCRegParser.RULE_atom);
        try {
            this.state = 59;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 4, this.context) ) {
            case 1:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 57;
                this.wordEquation();
                }
                break;
            case 2:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 58;
                this.regularConstraint();
                }
                break;
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public wordEquation(): WordEquationContext {
        let localContext = new WordEquationContext(this.context, this.state);
        this.enterRule(localContext, 10, FCRegParser.RULE_wordEquation);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 61;
            this.variable();
            this.state = 62;
            this.match(FCRegParser.EQUALS);
            this.state = 63;
            this.pattern();
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public regularConstraint(): RegularConstraintContext {
        let localContext = new RegularConstraintContext(this.context, this.state);
        this.enterRule(localContext, 12, FCRegParser.RULE_regularConstraint);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 65;
            this.variable();
            this.state = 66;
            this.match(FCRegParser.IN_CONSTRAINT);
            this.state = 67;
            this.match(FCRegParser.REGULAR_EXPRESSION);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public pattern(): PatternContext {
        let localContext = new PatternContext(this.context, this.state);
        this.enterRule(localContext, 14, FCRegParser.RULE_pattern);
        try {
            let alternative: number;
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 72;
            this.errorHandler.sync(this);
            alternative = 1;
            do {
                switch (alternative) {
                case 1:
                    {
                    this.state = 72;
                    this.errorHandler.sync(this);
                    switch (this.tokenStream.LA(1)) {
                    case FCRegParser.UNIVERSE_VAR:
                    case FCRegParser.VARNAME:
                        {
                        this.state = 69;
                        this.variable();
                        }
                        break;
                    case FCRegParser.STRING:
                        {
                        this.state = 70;
                        this.match(FCRegParser.STRING);
                        }
                        break;
                    case FCRegParser.EMPTY:
                        {
                        this.state = 71;
                        this.match(FCRegParser.EMPTY);
                        }
                        break;
                    default:
                        throw new antlr.NoViableAltException(this);
                    }
                    }
                    break;
                default:
                    throw new antlr.NoViableAltException(this);
                }
                this.state = 74;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 6, this.context);
            } while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public variable(): VariableContext {
        let localContext = new VariableContext(this.context, this.state);
        this.enterRule(localContext, 16, FCRegParser.RULE_variable);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 76;
            _la = this.tokenStream.LA(1);
            if(!(_la === 8 || _la === 16)) {
            this.errorHandler.recoverInline(this);
            }
            else {
                this.errorHandler.reportMatch(this);
                this.consume();
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }

    public override sempred(localContext: antlr.ParserRuleContext | null, ruleIndex: number, predIndex: number): boolean {
        switch (ruleIndex) {
        case 1:
            return this.formula_sempred(localContext as FormulaContext, predIndex);
        }
        return true;
    }
    private formula_sempred(localContext: FormulaContext | null, predIndex: number): boolean {
        switch (predIndex) {
        case 0:
            return this.precpred(this.context, 4);
        case 1:
            return this.precpred(this.context, 3);
        }
        return true;
    }

    public static readonly _serializedATN: number[] = [
        4,1,17,79,2,0,7,0,2,1,7,1,2,2,7,2,2,3,7,3,2,4,7,4,2,5,7,5,2,6,7,
        6,2,7,7,7,2,8,7,8,1,0,1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
        1,1,1,1,1,1,1,1,1,3,1,35,8,1,1,1,1,1,1,1,1,1,1,1,1,1,5,1,43,8,1,
        10,1,12,1,46,9,1,1,2,1,2,1,3,1,3,1,3,5,3,53,8,3,10,3,12,3,56,9,3,
        1,4,1,4,3,4,60,8,4,1,5,1,5,1,5,1,5,1,6,1,6,1,6,1,6,1,7,1,7,1,7,4,
        7,73,8,7,11,7,12,7,74,1,8,1,8,1,8,0,1,2,9,0,2,4,6,8,10,12,14,16,
        0,2,1,0,6,7,2,0,8,8,16,16,79,0,18,1,0,0,0,2,34,1,0,0,0,4,47,1,0,
        0,0,6,49,1,0,0,0,8,59,1,0,0,0,10,61,1,0,0,0,12,65,1,0,0,0,14,72,
        1,0,0,0,16,76,1,0,0,0,18,19,3,2,1,0,19,20,5,0,0,1,20,1,1,0,0,0,21,
        22,6,1,-1,0,22,35,3,8,4,0,23,24,5,1,0,0,24,35,3,2,1,5,25,26,3,4,
        2,0,26,27,3,6,3,0,27,28,5,13,0,0,28,29,3,2,1,2,29,35,1,0,0,0,30,
        31,5,10,0,0,31,32,3,2,1,0,32,33,5,11,0,0,33,35,1,0,0,0,34,21,1,0,
        0,0,34,23,1,0,0,0,34,25,1,0,0,0,34,30,1,0,0,0,35,44,1,0,0,0,36,37,
        10,4,0,0,37,38,5,2,0,0,38,43,3,2,1,5,39,40,10,3,0,0,40,41,5,3,0,
        0,41,43,3,2,1,4,42,36,1,0,0,0,42,39,1,0,0,0,43,46,1,0,0,0,44,42,
        1,0,0,0,44,45,1,0,0,0,45,3,1,0,0,0,46,44,1,0,0,0,47,48,7,0,0,0,48,
        5,1,0,0,0,49,54,5,16,0,0,50,51,5,12,0,0,51,53,5,16,0,0,52,50,1,0,
        0,0,53,56,1,0,0,0,54,52,1,0,0,0,54,55,1,0,0,0,55,7,1,0,0,0,56,54,
        1,0,0,0,57,60,3,10,5,0,58,60,3,12,6,0,59,57,1,0,0,0,59,58,1,0,0,
        0,60,9,1,0,0,0,61,62,3,16,8,0,62,63,5,9,0,0,63,64,3,14,7,0,64,11,
        1,0,0,0,65,66,3,16,8,0,66,67,5,4,0,0,67,68,5,5,0,0,68,13,1,0,0,0,
        69,73,3,16,8,0,70,73,5,15,0,0,71,73,5,14,0,0,72,69,1,0,0,0,72,70,
        1,0,0,0,72,71,1,0,0,0,73,74,1,0,0,0,74,72,1,0,0,0,74,75,1,0,0,0,
        75,15,1,0,0,0,76,77,7,1,0,0,77,17,1,0,0,0,7,34,42,44,54,59,72,74
    ];

    private static __ATN: antlr.ATN;
    public static get _ATN(): antlr.ATN {
        if (!FCRegParser.__ATN) {
            FCRegParser.__ATN = new antlr.ATNDeserializer().deserialize(FCRegParser._serializedATN);
        }

        return FCRegParser.__ATN;
    }


    private static readonly vocabulary = new antlr.Vocabulary(FCRegParser.literalNames, FCRegParser.symbolicNames, []);

    public override get vocabulary(): antlr.Vocabulary {
        return FCRegParser.vocabulary;
    }

    private static readonly decisionsToDFA = FCRegParser._ATN.decisionToState.map( (ds: antlr.DecisionState, index: number) => new antlr.DFA(ds, index) );
}

export class QueryContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public formula(): FormulaContext {
        return this.getRuleContext(0, FormulaContext)!;
    }
    public EOF(): antlr.TerminalNode {
        return this.getToken(FCRegParser.EOF, 0)!;
    }
    public override get ruleIndex(): number {
        return FCRegParser.RULE_query;
    }
    public override accept<Result>(visitor: FCRegVisitor<Result>): Result | null {
        if (visitor.visitQuery) {
            return visitor.visitQuery(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class FormulaContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public override get ruleIndex(): number {
        return FCRegParser.RULE_formula;
    }
    public override copyFrom(ctx: FormulaContext): void {
        super.copyFrom(ctx);
    }
}
export class AtomicContext extends FormulaContext {
    public constructor(ctx: FormulaContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public atom(): AtomContext {
        return this.getRuleContext(0, AtomContext)!;
    }
    public override accept<Result>(visitor: FCRegVisitor<Result>): Result | null {
        if (visitor.visitAtomic) {
            return visitor.visitAtomic(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
export class NegationContext extends FormulaContext {
    public constructor(ctx: FormulaContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public NEGATION(): antlr.TerminalNode {
        return this.getToken(FCRegParser.NEGATION, 0)!;
    }
    public formula(): FormulaContext {
        return this.getRuleContext(0, FormulaContext)!;
    }
    public override accept<Result>(visitor: FCRegVisitor<Result>): Result | null {
        if (visitor.visitNegation) {
            return visitor.visitNegation(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
export class QuantificationContext extends FormulaContext {
    public constructor(ctx: FormulaContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public quantifier(): QuantifierContext {
        return this.getRuleContext(0, QuantifierContext)!;
    }
    public varList(): VarListContext {
        return this.getRuleContext(0, VarListContext)!;
    }
    public COLON(): antlr.TerminalNode {
        return this.getToken(FCRegParser.COLON, 0)!;
    }
    public formula(): FormulaContext {
        return this.getRuleContext(0, FormulaContext)!;
    }
    public override accept<Result>(visitor: FCRegVisitor<Result>): Result | null {
        if (visitor.visitQuantification) {
            return visitor.visitQuantification(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
export class SubformulaContext extends FormulaContext {
    public constructor(ctx: FormulaContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public LEFT_BRACKET(): antlr.TerminalNode {
        return this.getToken(FCRegParser.LEFT_BRACKET, 0)!;
    }
    public formula(): FormulaContext {
        return this.getRuleContext(0, FormulaContext)!;
    }
    public RIGHT_BRACKET(): antlr.TerminalNode {
        return this.getToken(FCRegParser.RIGHT_BRACKET, 0)!;
    }
    public override accept<Result>(visitor: FCRegVisitor<Result>): Result | null {
        if (visitor.visitSubformula) {
            return visitor.visitSubformula(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
export class ConjunctionContext extends FormulaContext {
    public constructor(ctx: FormulaContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public formula(): FormulaContext[];
    public formula(i: number): FormulaContext | null;
    public formula(i?: number): FormulaContext[] | FormulaContext | null {
        if (i === undefined) {
            return this.getRuleContexts(FormulaContext);
        }

        return this.getRuleContext(i, FormulaContext);
    }
    public CONJUNCTION(): antlr.TerminalNode {
        return this.getToken(FCRegParser.CONJUNCTION, 0)!;
    }
    public override accept<Result>(visitor: FCRegVisitor<Result>): Result | null {
        if (visitor.visitConjunction) {
            return visitor.visitConjunction(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
export class DisjunctionContext extends FormulaContext {
    public constructor(ctx: FormulaContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public formula(): FormulaContext[];
    public formula(i: number): FormulaContext | null;
    public formula(i?: number): FormulaContext[] | FormulaContext | null {
        if (i === undefined) {
            return this.getRuleContexts(FormulaContext);
        }

        return this.getRuleContext(i, FormulaContext);
    }
    public DISJUNCTION(): antlr.TerminalNode {
        return this.getToken(FCRegParser.DISJUNCTION, 0)!;
    }
    public override accept<Result>(visitor: FCRegVisitor<Result>): Result | null {
        if (visitor.visitDisjunction) {
            return visitor.visitDisjunction(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class QuantifierContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public UNIVERSAL(): antlr.TerminalNode | null {
        return this.getToken(FCRegParser.UNIVERSAL, 0);
    }
    public EXISTENTIAL(): antlr.TerminalNode | null {
        return this.getToken(FCRegParser.EXISTENTIAL, 0);
    }
    public override get ruleIndex(): number {
        return FCRegParser.RULE_quantifier;
    }
    public override accept<Result>(visitor: FCRegVisitor<Result>): Result | null {
        if (visitor.visitQuantifier) {
            return visitor.visitQuantifier(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class VarListContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public VARNAME(): antlr.TerminalNode[];
    public VARNAME(i: number): antlr.TerminalNode | null;
    public VARNAME(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(FCRegParser.VARNAME);
    	} else {
    		return this.getToken(FCRegParser.VARNAME, i);
    	}
    }
    public COMMA(): antlr.TerminalNode[];
    public COMMA(i: number): antlr.TerminalNode | null;
    public COMMA(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(FCRegParser.COMMA);
    	} else {
    		return this.getToken(FCRegParser.COMMA, i);
    	}
    }
    public override get ruleIndex(): number {
        return FCRegParser.RULE_varList;
    }
    public override accept<Result>(visitor: FCRegVisitor<Result>): Result | null {
        if (visitor.visitVarList) {
            return visitor.visitVarList(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class AtomContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public wordEquation(): WordEquationContext | null {
        return this.getRuleContext(0, WordEquationContext);
    }
    public regularConstraint(): RegularConstraintContext | null {
        return this.getRuleContext(0, RegularConstraintContext);
    }
    public override get ruleIndex(): number {
        return FCRegParser.RULE_atom;
    }
    public override accept<Result>(visitor: FCRegVisitor<Result>): Result | null {
        if (visitor.visitAtom) {
            return visitor.visitAtom(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class WordEquationContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public variable(): VariableContext {
        return this.getRuleContext(0, VariableContext)!;
    }
    public EQUALS(): antlr.TerminalNode {
        return this.getToken(FCRegParser.EQUALS, 0)!;
    }
    public pattern(): PatternContext {
        return this.getRuleContext(0, PatternContext)!;
    }
    public override get ruleIndex(): number {
        return FCRegParser.RULE_wordEquation;
    }
    public override accept<Result>(visitor: FCRegVisitor<Result>): Result | null {
        if (visitor.visitWordEquation) {
            return visitor.visitWordEquation(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class RegularConstraintContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public variable(): VariableContext {
        return this.getRuleContext(0, VariableContext)!;
    }
    public IN_CONSTRAINT(): antlr.TerminalNode {
        return this.getToken(FCRegParser.IN_CONSTRAINT, 0)!;
    }
    public REGULAR_EXPRESSION(): antlr.TerminalNode {
        return this.getToken(FCRegParser.REGULAR_EXPRESSION, 0)!;
    }
    public override get ruleIndex(): number {
        return FCRegParser.RULE_regularConstraint;
    }
    public override accept<Result>(visitor: FCRegVisitor<Result>): Result | null {
        if (visitor.visitRegularConstraint) {
            return visitor.visitRegularConstraint(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class PatternContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public variable(): VariableContext[];
    public variable(i: number): VariableContext | null;
    public variable(i?: number): VariableContext[] | VariableContext | null {
        if (i === undefined) {
            return this.getRuleContexts(VariableContext);
        }

        return this.getRuleContext(i, VariableContext);
    }
    public STRING(): antlr.TerminalNode[];
    public STRING(i: number): antlr.TerminalNode | null;
    public STRING(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(FCRegParser.STRING);
    	} else {
    		return this.getToken(FCRegParser.STRING, i);
    	}
    }
    public EMPTY(): antlr.TerminalNode[];
    public EMPTY(i: number): antlr.TerminalNode | null;
    public EMPTY(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(FCRegParser.EMPTY);
    	} else {
    		return this.getToken(FCRegParser.EMPTY, i);
    	}
    }
    public override get ruleIndex(): number {
        return FCRegParser.RULE_pattern;
    }
    public override accept<Result>(visitor: FCRegVisitor<Result>): Result | null {
        if (visitor.visitPattern) {
            return visitor.visitPattern(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class VariableContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public VARNAME(): antlr.TerminalNode | null {
        return this.getToken(FCRegParser.VARNAME, 0);
    }
    public UNIVERSE_VAR(): antlr.TerminalNode | null {
        return this.getToken(FCRegParser.UNIVERSE_VAR, 0);
    }
    public override get ruleIndex(): number {
        return FCRegParser.RULE_variable;
    }
    public override accept<Result>(visitor: FCRegVisitor<Result>): Result | null {
        if (visitor.visitVariable) {
            return visitor.visitVariable(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
