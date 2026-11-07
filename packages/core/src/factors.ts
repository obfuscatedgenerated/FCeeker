import type {UnicodeWord} from "./unicode";

export const factorise = (word: UnicodeWord) => {
    const factor_set = new Set<string>([""]);

    // sliding window
    for (let window_size = 1; window_size <= word.n_codepoints; window_size++) {
        for (let window_start = 0; window_start <= word.n_codepoints - window_size; window_start++) {
            const factor = word.substring(window_start, window_start + window_size);
            factor_set.add(factor);
        }
    }

    return Array.from(factor_set);
}
export const generate_factors = function* (word: UnicodeWord): Generator<string> {
    // empty string always returned first
    yield "";

    // sliding window
    for (let window_size = 1; window_size <= word.n_codepoints; window_size++) {
        for (let window_start = 0; window_start <= word.n_codepoints - window_size; window_start++) {
            const factor = word.substring(window_start, window_start + window_size);
            yield factor;
        }
    }
}

export const generate_assignments_from_list = function* (
    variables: string[],
    factors: string[],
    base: ReadonlyMap<string, string> = new Map<string, string>()
): Generator<ReadonlyMap<string, string>> {
    // there will be F^k "rows" to assign
    const assignment_count = factors.length ** variables.length
    for (let idx = 0; idx < assignment_count; idx++) {
        const assignments = new Map<string, string>(base);

        for (let variable_idx = 0; variable_idx < variables.length; variable_idx++) {
            const var_name = variables[variable_idx]!;

            // each variable v changes every F^rank(v)
            // therefore for a given iteration i, each variable v recieves the factor at index floor(i / F^rank(v)) mod F
            const factor_idx = Math.floor(idx / (factors.length ** variable_idx)) % factors.length;

            assignments.set(var_name, factors[factor_idx]!);
        }

        yield assignments;
    }
}

export const generate_assignments_from_generator = function* (
    variables: string[],
    factor_gen: Generator<string>,
    base?: ReadonlyMap<string, string>
): Generator<ReadonlyMap<string, string>> {
    const state = new Map(base);
    const collected_factors = [];
    const seen_factors = new Set<string>();

    let gen_done = false;

    // initialise each assignment to first factor (usually empty word)
    const first = factor_gen.next();
    if (first.done) {
        gen_done = true;
    }

    const first_factor = first.value;
    collected_factors.push(first_factor);
    seen_factors.add(first_factor);
    for (let variable_idx = 0; variable_idx < variables.length; variable_idx++) {
        const var_name = variables[variable_idx]!;
        state.set(var_name, first_factor);
    }

    yield new Map(state);

    if (gen_done) {
        return;
    }


    // roll through every factor from the generator in order on the first variable, collecting to loop again
    while (!gen_done) {
        // take the next unseen factor
        let factor: string;
        do {
            const next = factor_gen.next();
            factor = next.value;

            // TODO: tell the caller about duplicates
            if (next.done) {
                gen_done = true;
                break;
            }
        } while (seen_factors.has(factor))

        if (gen_done) {
            break;
        }

        // collect factor
        collected_factors.push(factor);
        seen_factors.add(factor);

        // assign to first variable and yield
        state.set(variables[0]!, factor);
        yield new Map(state);
    }

    // continue by assigning in a rolling pattern, where the first var changes every iteration, the second every F, the third every F^2 etc
    const factor_count = seen_factors.size;
    const assignment_count = factor_count ** variables.length;

    // already assigned F times previously
    for (let idx = factor_count; idx < assignment_count; idx++) {
        for (let variable_idx = 0; variable_idx < variables.length; variable_idx++) {
            const var_name = variables[variable_idx]!;

            // each variable v changes every F^rank(v)
            // therefore for a given iteration i, each variable v recieves the factor at index floor(i / F^rank(v)) mod F
            const factor_idx = Math.floor(idx / (factor_count ** variable_idx)) % factor_count;

            state.set(var_name, collected_factors[factor_idx]!);
        }

        yield new Map(state);
    }
}

interface VarCounter {
    start: number;
    size: number;
}

export const generate_assignments_from_spans = function* (
    variables: string[],
    word: UnicodeWord,
    base?: ReadonlyMap<string, string>
): Generator<ReadonlyMap<string, string>> {
    // TODO: skip duplicates via canonical check

    // for each variable, track a start and size counter
    const var_counters: VarCounter[] = variables.map(() => ({
        start: 0,
        size: 0
    }));

    // increments a single counter, returning whether it wrapped around
    const increment_counter = (counter: VarCounter): boolean => {
        if (counter.size === 0) {
            counter.start = 0;

            if (word.n_codepoints === 0) {
                return true;
            }

            counter.size = 1;
            return false;
        }

        if (++counter.start + counter.size > word.n_codepoints) {
            counter.start = 0;
            if (++counter.size > word.n_codepoints) {
                counter.size = 0;
                return true;
            }
        }

        return false;
    }

    // increment the first variable, if it wraps around then increment the second, etc, returning whether the last variable wrapped around (meaning all variables are tested)
    const increment_variables = (): boolean => {
        for (let variable_idx = 0; variable_idx < variables.length; variable_idx++) {
            const wrapped = increment_counter(var_counters[variable_idx]!);
            if (!wrapped) {
                // it didn't wrap, so must still be mid-cycle, therefore nothing else to do
                return false;
            }
        }

        // all wrapped, meaning the last wrapped
        return true;
    }

    while (true) {
        const assignments = new Map<string, string>(base);

        // take current assignment
        for (let variable_idx = 0; variable_idx < variables.length; variable_idx++) {
            const var_name = variables[variable_idx]!;
            const counter = var_counters[variable_idx]!;
            assignments.set(var_name, word.substring(counter.start, counter.start + counter.size));
        }

        yield assignments;

        const done = increment_variables();
        if (done) {
            break;
        }
    }
}


// TODO: suffix arrays and LCP
