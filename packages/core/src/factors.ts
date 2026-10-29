export const factorise = (word: string) => {
    const factor_set = new Set<string>([""]);

    // iterate in codepoints, not chars (otherwise 2-wide unicode gets split up)
    const word_codepoints = Array.from(word);

    // sliding window
    for (let window_size = 1; window_size <= word_codepoints.length; window_size++) {
        for (let window_start = 0; window_start <= word_codepoints.length - window_size; window_start++) {
            const factor = word_codepoints.slice(window_start, window_start + window_size).join("");
            factor_set.add(factor);
        }
    }

    return Array.from(factor_set);
}

export const generate_assignments = function* (variables: string[], factors: string[], base: ReadonlyMap<string, string> = new Map<string, string>()): Generator<ReadonlyMap<string, string>> {
    // there will be F^k "rows" to assign
    const factor_count = factors.length ** variables.length
    for (let idx = 0; idx < factor_count; idx++) {
        const assignments = new Map<string, string>(base);

        for (let variable_idx = 0; variable_idx < variables.length; variable_idx++) {
            const var_name = variables[variable_idx]!;

            // use place value on the row index in base F, the value at this variable's place is its factor index
            const factor_idx = Math.floor(idx / (factors.length ** variable_idx)) % factors.length;

            assignments.set(var_name, factors[factor_idx]!);
        }

        yield assignments;
    }
}
