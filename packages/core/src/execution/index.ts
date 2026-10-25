import type {FormulaNode} from "@fceeker/ast";
import {collect_free_variables} from "../variables";

interface QueryResultBase {
    warnings: string[];
}

export interface QueryResultBoolean extends QueryResultBase {
    type: "boolean",
    result: boolean;
}

export interface QueryResultFactors extends QueryResultBase {
    type: "factors";
    result: Map<string, string>;
}

export interface QueryResultError extends QueryResultBase {
    type: "error";
    message: string;
}

export type QueryResult = QueryResultBoolean | QueryResultFactors | QueryResultError;

export const execute = (formula: FormulaNode): QueryResult => {
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

    // TODO

    return {
        ...base_result,
        type: "error",
        message: "Execution unimplemented"
    };
}
