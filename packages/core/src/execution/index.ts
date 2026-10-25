import type {FormulaNode, Pattern} from "@fceeker/ast";
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

export const satisfies = (formula: FormulaNode, ctx: EvaluationContext): boolean => {
    if (formula.type !== "WordEquation") {
        throw new Error(`Only word equation atoms are supported so far. Got: ${formula.type}`);
    }

    return word_equation_satisfies(formula, ctx);
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
