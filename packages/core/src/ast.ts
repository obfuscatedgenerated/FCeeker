interface ASTNodeBase {
    type: string;
    span: [number, number];
}

export interface NamedVariableNode extends ASTNodeBase {
    type: "NamedVariable";
    name: string;
}

export interface UniverseVariableNode extends ASTNodeBase {
    type: "UniverseVariable";
}

export type VariableNode = NamedVariableNode | UniverseVariableNode;

export interface WordEquationNode extends ASTNodeBase {
    type: "WordEquation";
    variable: VariableNode;
    pattern: readonly (VariableNode | string)[];
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
