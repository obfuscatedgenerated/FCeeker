import type {FormulaNode} from "@fceeker/ast";
import {collect_free_variables} from "../variables";

export interface QueryResultBoolean {
    type: "boolean",
    result: boolean;
}

export interface QueryResultFactors {
    type: "factors";
    result: Map<string, string>;
}

export interface QueryResultError {
    type: "error";
    message: string;
}

export type QueryResult = QueryResultBoolean | QueryResultFactors | QueryResultError;

export const execute = (formula: FormulaNode): QueryResult => {
    const free_vars = collect_free_variables(formula);
    if (free_vars.size !== 0) {
        console.warn(`Queries with free variables will not yet return their factors. Free variables: ${Array.from(free_vars.values()).join(", ")}`);
    }

    if (formula.type !== "WordEquation") {
        return {
            type: "error",
            message: `Only word equation atoms are supported so far. Got: ${formula.type}`
        };
    }

    // TODO
}
