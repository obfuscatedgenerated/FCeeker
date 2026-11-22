import {describe, it, expect} from "vitest";
import {expected_cases} from "./expected_cases";
import {run_query_naive, as_result_set, expected_set} from "./helpers";

describe("query integration tests - naive evaluator", () => {
    it.each(expected_cases)("$name", (expected_case) => {
        const result = run_query_naive(expected_case.query, expected_case.word);

        if ("expected_boolean" in expected_case) {
            if (result.type !== "boolean") {
                throw new Error(`Expected a boolean result, got ${result.type}`);
            }

            expect(result.result).toBe(expected_case.expected_boolean);
        } else {
            if (result.type !== "factors") {
                throw new Error(`Expected factors, got ${result.type}`);
            }

            expect(as_result_set(result.result)).toEqual(expected_set(expected_case.expected_factors));
        }
    });
});
