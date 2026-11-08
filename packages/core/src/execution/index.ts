import {type FormulaNode, get_children, type Pattern} from "@fceeker/ast";
import {collect_free_variables} from "../variables";
import {word_equation_satisfies} from "./word_equation";
import {
    factorise,
    generate_assignments_from_generator,
    generate_assignments_from_list, generate_assignments_from_spans,
    generate_factors
} from "../factors";
import {build_unicode_word, type UnicodeWord} from "../unicode";

interface QueryResultBase {
    warnings: string[];
}

export interface QueryResultBoolean extends QueryResultBase {
    type: "boolean",
    result: boolean;
}

export interface QueryResultFactors extends QueryResultBase {
    type: "factors";
    result: Set<ReadonlyMap<string, string>>;
}

export interface QueryResultError extends QueryResultBase {
    type: "error";
    message: string;
}

export type QueryResult = QueryResultBoolean | QueryResultFactors | QueryResultError;

export interface EvaluationContext {
    word: UnicodeWord; // TODO: accept both string and UnicodeWord
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

interface ExecuteOpts {
    progress_start?: (total: number) => void;
    progress_tick?: (count?: number) => void;
    on_found?: (assignments: ReadonlyMap<string, string>) => void;
    // TODO: should warn move here as a callback? should there be a callback to get results as they come in?
}

export const execute = (formula: FormulaNode, word: string | UnicodeWord, opts: ExecuteOpts = {}): QueryResult => {
    const base_result: QueryResultBase = {
        warnings: []
    };

    if (typeof word === "string") {
        word = build_unicode_word(word);
    }

    const free_vars = collect_free_variables(formula);
    //const factor_gen = generate_factors(word);

    if (opts.progress_start) {
        // this loses precision for high numbers, but node-progress doesnt take bigint anyway
        opts.progress_start(word.possible_factors ** free_vars.size);
    }

    //const assignment_gen = generate_assignments_from_generator(Array.from(free_vars), factor_gen);
    const assignment_gen = generate_assignments_from_spans(Array.from(free_vars), word);

    const output = new Set<ReadonlyMap<string, string>>();

    for (const assignments of assignment_gen) {
        const result = satisfies(formula, {
            word,
            assignments,
            skip_factor_check: true
        });

        if (result) {
            output.add(assignments);
        }

        if (opts.progress_tick) {
            opts.progress_tick();
        }

        if (result && opts.on_found) {
            opts.on_found(assignments);
        }
    }

    // TODO: will need to evaluate assignments for quantifiers once implemented

    return {
        ...base_result,
        type: "factors",
        result: output
    };
}
