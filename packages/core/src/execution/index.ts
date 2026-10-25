import type {FormulaNode, Pattern} from "@fceeker/ast";
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
    result: ReadonlyMap<string, string>;
}

export interface QueryResultError extends QueryResultBase {
    type: "error";
    message: string;
}

export type QueryResult = QueryResultBoolean | QueryResultFactors | QueryResultError;

export const compute_pattern = (pattern: Readonly<Pattern>, assignments: ReadonlyMap<string, string>, word: string, skip_factor_check = false): string => {
    let output = "";

    for (const fragment of pattern) {
        switch (fragment.type) {
            case "StringLiteral":
                output += fragment.value;
                break;
            case "UniverseVariable":
                output += word;
                break;
            case "NamedVariable": {
                const frag_val = assignments.get(fragment.name);
                if (frag_val !== undefined) {
                    if (!skip_factor_check && !word.includes(frag_val)) {
                        throw new Error(`${frag_val} is not a factor of ${word}`);
                    }

                    output += frag_val;
                } else {
                    throw new Error(`Unbound variable ${fragment.name}`);
                }
            }
                break
        }
    }

    return output;
}

export const satisfies = (formula: FormulaNode, word: string, assignments: ReadonlyMap<string, string>, skip_factor_check = false): boolean => {
    if (formula.type !== "WordEquation") {
        throw new Error(`Only word equation atoms are supported so far. Got: ${formula.type}`);
    }

    let lhs_value: string;
    if (formula.variable.type === "UniverseVariable") {
        // the universe is the input word
        lhs_value = word;
    } else if (assignments.has(formula.variable.name)) {
        lhs_value = assignments.get(formula.variable.name)!;

        if (!skip_factor_check && !word.includes(lhs_value)) {
            throw new Error(`${lhs_value} is not a factor of ${word}`);
        }
    } else {
        throw new Error(`Unbound variable ${formula.variable.name}`);
    }

    const rhs_value = compute_pattern(formula.pattern, assignments, word, skip_factor_check);

    return (lhs_value === rhs_value);
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
