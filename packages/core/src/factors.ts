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
