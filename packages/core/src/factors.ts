export const factors = (word: string) => {
    const factor_set = new Set<string>([""]);

    // sliding window
    for (let window_size = 0; window_size < word.length; window_size++) {
        for (let window_start = 0; window_start < word.length - window_size; window_start++) {
            const factor = word.substring(window_start, window_start + window_size);
            factor_set.add(factor);
        }
    }

    return factor_set;
}
