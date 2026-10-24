// a span should be counted as character offsets, not codepoints
export interface Span {
    start: number; // inclusive
    end: number; // exclusive
}

interface ASTNodeBase {
    type: string;
    span: Span;
}

export interface NamedVariableNode extends ASTNodeBase {
    type: "NamedVariable";
    name: string;
}

export interface UniverseVariableNode extends ASTNodeBase {
    type: "UniverseVariable";
}

export type VariableNode = NamedVariableNode | UniverseVariableNode;

export interface StringLiteralNode extends ASTNodeBase {
    type: "StringLiteral";
    value: string;
}

export interface WordEquationNode extends ASTNodeBase {
    type: "WordEquation";
    variable: VariableNode;
    pattern: readonly (VariableNode | StringLiteralNode)[];
}

export interface RegularConstraintNode extends ASTNodeBase {
    type: "RegularConstraint";
    variable: VariableNode;
    regex: string;
}

export type AtomNode = WordEquationNode | RegularConstraintNode;

export interface NegationNode extends ASTNodeBase {
    type: "Negation";
    formula: FormulaNode;
}

export interface ConjunctionNode extends ASTNodeBase {
    type: "Conjunction";
    formulae: readonly FormulaNode[];
}

export interface DisjunctionNode extends ASTNodeBase {
    type: "Disjunction";
    formulae: readonly FormulaNode[];
}

export interface UniversalQuantificationNode extends ASTNodeBase {
    type: "UniversalQuantification";
    variables: readonly NamedVariableNode[];
    formula: FormulaNode;
}

export interface ExistentialQuantificationNode extends ASTNodeBase {
    type: "ExistentialQuantification";
    variables: readonly NamedVariableNode[];
    formula: FormulaNode;
}

export type QuantificationNode = UniversalQuantificationNode | ExistentialQuantificationNode;

export type FormulaNode =
    AtomNode
    | NegationNode
    | ConjunctionNode
    | DisjunctionNode
    | QuantificationNode
    ;
