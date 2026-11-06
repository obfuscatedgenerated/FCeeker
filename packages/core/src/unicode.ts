// antlr gives its spans in codepoints, but utf-16 offsets are what javascript uses, so build a table to convert
// also now used for handling unicode input words
export const build_codepoint_offset_table = (text: string): number[] => {
    const codepoint_offsets: number[] = [];
    let offset = 0;

    for (const codepoint of text) {
        codepoint_offsets.push(offset);
        offset += codepoint.length;
    }

    codepoint_offsets.push(offset);

    return codepoint_offsets;
}

export interface UnicodeWord {
    // original text as a javascript utf-16 string
    text: string;

    // the text as an array of codepoints, where each codepoint is a string (which may be multiple utf-16 code units)
    as_codepoints: () => string[];

    // the codepoint offset table, where codepoint_offsets[i] is the utf-16 offset of the i-th codepoint in the string
    codepoint_offsets: number[];

    // the number of codepoints, i.e. the real length of the string in terms of unicode characters, not utf-16 code units
    n_codepoints: number;

    // unicode-aware substring using the codepoint offset table
    substring: (start: number, end: number) => string;

    // the maximum possible number of factors, assuming duplicates arent skipped (as this is precomputed)
    // for each window size w there are n - w+1 start positions, summed over w = 1...n =  n(n+1)/2 (+ the empty)
    possible_factors: number;
}

export const build_unicode_word = (text: string): UnicodeWord => {
    const codepoint_offsets = build_codepoint_offset_table(text);
    const n_codepoints = codepoint_offsets.length - 1;

    return {
        text,
        as_codepoints: () => Array.from(text),
        codepoint_offsets,
        n_codepoints,
        substring: (start: number, end: number) => text.slice(codepoint_offsets[start], codepoint_offsets[end]),
        possible_factors: 1 + (n_codepoints * (n_codepoints + 1)) / 2,
    }
}
