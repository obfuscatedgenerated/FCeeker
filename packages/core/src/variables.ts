import {type ASTNode, find_all_in_ast, get_children, type QuantificationNode} from "@fceeker/ast";

// TODO: should these return variable nodes? will still need to use name to ensure unique instances arent both added

export const collect_free_variables = (node: ASTNode, free = new Set<string>()): Set<string> => {
    switch (node.type) {
        case "WordEquation":
            if (node.variable.type === "NamedVariable") {
                free.add(node.variable.name);
            }

            for (const fragment of node.pattern) {
                if (fragment.type === "NamedVariable") {
                    free.add(fragment.name);
                }
            }

            break;
        case "RegularConstraint":
            if (node.variable.type === "NamedVariable") {
                free.add(node.variable.name);
            }

            break;
        case "Negation":
        case "Conjunction":
        case "Disjunction":
            for (const child of get_children(node)) {
                collect_free_variables(child, free);
            }

            break;
        case "ExistentialQuantification":
        case "UniversalQuantification": {
            const local_free = new Set<string>();
            collect_free_variables(node.formula, local_free);

            // collect all var names bound in the quantification
            const bound = new Set<string>();
            for (const bound_var of node.variables) {
                bound.add(bound_var.name);
            }

            // add anything not bound in the quantification to the shared free set
            for (const var_name of local_free) {
                if (!bound.has(var_name)) {
                    free.add(var_name);
                }
            }

            break;
        }
    }

    return free;
}

export const collect_bound_variables = (node: ASTNode) => {
    const quants = find_all_in_ast(
        node,
        (n) => n.type === "ExistentialQuantification" || n.type === "UniversalQuantification"
    ) as QuantificationNode[];

    const bound = new Set<string>();
    for (const quant of quants) {
        quant.variables.forEach((v) => bound.add(v.name));
    }

    return bound;
}
