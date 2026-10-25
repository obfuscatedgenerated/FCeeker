import {type FormulaNode, get_children, type Pattern} from "@fceeker/ast";
import {collect_free_variables} from "../variables";
import {word_equation_satisfies} from "./word_equation";

interface QueryResultBase {
    warnings: string[];
}

export interface QueryResultBoolean extends QueryResultBase {
    type: "boolean",
    result: boolean;
}

export interface QueryResultFactors extends QueryResultBase {
    type: "factors";
    result: ReadonlyMap<string, string>;
}

export interface QueryResultError extends QueryResultBase {
    type: "error";
    message: string;
}

export type QueryResult = QueryResultBoolean | QueryResultFactors | QueryResultError;

export interface EvaluationContext {
    word: string;
    assignments: ReadonlyMap<string, string>;
    skip_factor_check?: boolean;
}

// checks if a formula is satisifed under the given assignments via post-order recursion
export const satisfies = (root_formula: FormulaNode, ctx: EvaluationContext): boolean => {
    switch (root_formula.type) {
        case "WordEquation":
            return word_equation_satisfies(root_formula, ctx);
        case "Negation":
            return !satisfies(root_formula.formula, ctx);
        case "Disjunction":
            // lazily evaluate in order, stopping at the first truth (short-circuiting)
            for (const formula of root_formula.formulae) {
                if (satisfies(formula, ctx)) {
                    return true;
                }
            }

            return false;
        case "Conjunction":
            // lazily evaluate in order, stopping at the first false (short-circuiting)
            for (const formula of root_formula.formulae) {
                if (!satisfies(formula, ctx)) {
                    return false;
                }
            }

            return true;
        default:
            throw new Error(`${root_formula.type} formulae not yet supported`);
    }
}

export const check_factors = (word: string, assignments: ReadonlyMap<string, string>) => {
    for (const val of assignments.values()) {
        if (!word.includes(val)) {
            throw new Error(`${val} is not a factor of ${word}`);
        }
    }
}

export const execute = (formula: FormulaNode, word: string): QueryResult => {
    const base_result: QueryResultBase = {
        warnings: []
    };

    const free_vars = collect_free_variables(formula);
    if (free_vars.size !== 0) {
        base_result.warnings.push(`Queries with free variables will not yet return their factors. Free variables: ${Array.from(free_vars.values()).join(", ")}`);
    }

    if (formula.type !== "WordEquation") {
        return {
            ...base_result,
            type: "error",
            message: `Only word equation atoms are supported so far. Got: ${formula.type}`,
        };
    }

    // TODO: enumerate factors and check satisfies

    return {
        ...base_result,
        type: "error",
        message: "Execution unimplemented"
    };
}
