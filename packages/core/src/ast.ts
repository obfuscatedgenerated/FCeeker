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

// preorder traversal, with a callback that can optionally return true to stop the walk
// returns whether it stopped (so it can bubble up the recursive stack)
export const walk_ast = (root: ASTNode, callback: (node: ASTNode) => void | boolean): boolean => {
    const stop = callback(root);
    if (stop) {
        return true;
    }

    const children = get_children(root);
    for (const child of children) {
        const stopped = walk_ast(child, callback);
        if (stopped) {
            return true;
        }
    }

    return false;
}

export const find_first_in_ast = (root: ASTNode, predicate: (node: ASTNode) => boolean): ASTNode | null => {
    let found: ASTNode | null = null;
    walk_ast(root, (node) => {
        const result = predicate(node);
        if (result) {
            found = node;

            // stop walk
            return true;
        }
    });

    return found;
}

export const find_all_in_ast = (root: ASTNode, predicate: (node: ASTNode) => boolean): ASTNode[] => {
    const found: ASTNode[] = [];
    walk_ast(root, (node) => {
        const result = predicate(node);
        if (result) {
            found.push(node);
        }
    });

    return found;
}

export const every_in_ast = (root: ASTNode, predicate: (node: ASTNode) => boolean): boolean => {
    let output = true;
    walk_ast(root, (node) => {
        const result = predicate(node);
        if (!result) {
            output = false;

            // stop walk
            return true;
        }
    });

    return output;
}

export const some_in_ast = (root: ASTNode, predicate: (node: ASTNode) => boolean): boolean => {
    return !!find_first_in_ast(root, predicate);
}
