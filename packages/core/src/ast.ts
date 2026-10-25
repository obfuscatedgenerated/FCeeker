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

export type Pattern = (VariableNode | StringLiteralNode)[];

export interface WordEquationNode extends ASTNodeBase {
    type: "WordEquation";
    variable: VariableNode;
    pattern: Readonly<Pattern>;
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

export type ASTNode = FormulaNode | VariableNode | StringLiteralNode;


// returns all direct child nodes of an ast node
export const get_children = (node: ASTNode): readonly ASTNode[] => {
    switch (node.type) {
        case "NamedVariable":
        case "UniverseVariable":
        case "StringLiteral":
            return [];
        case "WordEquation":
            return [node.variable, ...node.pattern]
        case "RegularConstraint":
            return [node.variable];
        case "Negation":
            return [node.formula];
        case "Disjunction":
        case "Conjunction":
            return node.formulae;
        case "ExistentialQuantification":
        case "UniversalQuantification":
            return [...node.variables, node.formula];
        default:
            //@ts-ignore
            throw new Error(`Unexpected node type ${node.type}`);
    }
}

// preorder traversal
export const walk_ast = (root: ASTNode, callback: (node: ASTNode) => void): void => {
    callback(root);

    const children = get_children(root);
    for (const child of children) {
        walk_ast(child, callback);
    }
}
