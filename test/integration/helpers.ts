import parse from "@fceeker/parser-antlr";
import {execute} from "@fceeker/core";

export const run_query_naive = (query: string, word: string) => {
    const parsed = parse(query);
    if (!parsed.success) {
        throw new Error(`Parse failed: ${parsed.errors.map(error => error.message).join(", ")}`);
    }

    return execute(parsed.ast, word);
};

const row_key = (entries: Iterable<[string, string]>) =>
    JSON.stringify([...entries].sort(([key_a], [key_b]) => key_a.localeCompare(key_b)));

export const as_result_set = (rows: Iterable<ReadonlyMap<string, string>>) =>
    new Set([...rows].map(row => row_key(row)));

export const expected_set = (rows: Record<string, string>[]) =>
    new Set(rows.map(row => row_key(Object.entries(row))));
