import type {Pattern, WordEquationNode} from "@fceeker/ast";
import type {EvaluationContext} from "./index";
import {get_variable_value} from "../variables";

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
                const frag_val = get_variable_value(fragment, assignments, word);
                if (!skip_factor_check && !word.includes(frag_val)) {
                    throw new Error(`${frag_val} is not a factor of ${word}`);
                }

                output += frag_val;
            }
                break
        }
    }

    return output;
}

export const word_equation_satisfies = (equation: WordEquationNode, {word, assignments, skip_factor_check}: EvaluationContext): boolean => {
    let lhs_value: string;
    if (equation.variable.type === "UniverseVariable") {
        // the universe is the input word
        lhs_value = word.text;
    } else if (assignments.has(equation.variable.name)) {
        lhs_value = assignments.get(equation.variable.name)!;

        if (!skip_factor_check && !word.text.includes(lhs_value)) {
            throw new Error(`${lhs_value} is not a factor of ${word.text}`);
        }
    } else {
        throw new Error(`Unbound variable ${equation.variable.name}`);
    }

    const rhs_value = compute_pattern(equation.pattern, assignments, word.text, skip_factor_check);

    return (lhs_value === rhs_value);
}
