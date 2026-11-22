export type ExpectedCase = {
    name: string;
    query: string;
    word: string;
} & (
    | {expected_boolean: boolean}
    | {expected_factors: Record<string, string>[]}
    );

export const expected_cases: ExpectedCase[] = [
    {
        name: "copy language accepts ww",
        query: `EXISTS x: $U = x x`,
        word: "abab",
        expected_boolean: true,
    },
    {
        name: "copy language rejects non-square",
        query: `EXISTS x: $U = x x`,
        word: "aba",
        expected_boolean: false,
    },
    {
        name: "factors of length 2",
        query: `EXISTS p, s: $U = p x s AND x IN /../`,
        word: "abb",
        expected_factors: [{x: "ab"}, {x: "bb"}],
    },
    {
        name: "x = x lists every factor including ε",
        query: `x = x`,
        word: "aba",
        expected_factors: [
            {x: ""},
            {x: "a"},
            {x: "b"},
            {x: "ab"},
            {x: "ba"},
            {x: "aba"},
        ],
    },
    {
        name: "empty input word has only ε as a factor",
        query: `x = x`,
        word: "",
        expected_factors: [
            {x: ""},
        ],
    },
    {
        name: "universe equals ε on empty input",
        query: `$U = ""`,
        word: "",
        expected_boolean: true,
    },
    {
        name: "ε is a square of ε",
        query: `EXISTS x: $U = x x`,
        word: "",
        expected_boolean: true,
    },
    {
        name: "equation with ε literal",
        query: `x = ""`,
        word: "ab",
        expected_factors: [
            {x: ""},
        ],
    },
    {
        name: "EMPTY keyword",
        query: `x = EMPTY`,
        word: "ab",
        expected_factors: [
            {x: ""},
        ],
    },
    {
        name: "negation excludes ε",
        query: `x = x AND NOT x = ""`,
        word: "ab",
        expected_factors: [
            {x: "a"},
            {x: "b"},
            {x: "ab"},
        ],
    },
    {
        name: "regex must match the whole factor",
        query: `x IN /a/`,
        word: "aab",
        expected_factors: [
            {x: "a"},
        ],
    },
    {
        name: "regex with repetition",
        query: `x IN /a+/`,
        word: "aab",
        expected_factors: [
            {x: "a"},
            {x: "aa"},
        ],
    },
    {
        name: "regex star accepts ε",
        query: `x IN /a*/`,
        word: "ba",
        expected_factors: [
            {x: ""},
            {x: "a"},
        ],
    },
    {
        name: "string literal factor present",
        query: `EXISTS p, s: $U = p "ab" s`,
        word: "aab",
        expected_boolean: true,
    },
    {
        name: "string literal factor absent",
        query: `EXISTS p, s: $U = p "ab" s`,
        word: "ba",
        expected_boolean: false,
    },
    {
        name: "variables only range over factors",
        query: `EXISTS x: x = "c"`,
        word: "ab",
        expected_boolean: false,
    },
    {
        name: "universal holds",
        query: `FORALL x: x IN /[ab]*/`,
        word: "abba",
        expected_boolean: true,
    },
    {
        name: "universal fails on one counterexample",
        query: `FORALL x: x IN /a*/`,
        word: "ab",
        expected_boolean: false,
    },
    {
        name: "no factor aa (holds)",
        query: `FORALL x: NOT x IN /aa/`,
        word: "abab",
        expected_boolean: true,
    },
    {
        name: "no factor aa (fails)",
        query: `FORALL x: NOT x IN /aa/`,
        word: "aab",
        expected_boolean: false,
    },
    {
        name: "tautology over pairs",
        query: `FORALL x, y: x = y OR NOT x = y`,
        word: "ab",
        expected_boolean: true,
    },
    {
        name: "disjunction",
        query: `x = "a" OR x = "b"`,
        word: "abc",
        expected_factors: [
            {x: "a"},
            {x: "b"},
        ],
    },
    {
        name: "contradiction has no results",
        query: `x = "a" AND x = "b"`,
        word: "ab",
        expected_factors: [],
    },
    {
        name: "negation binds tighter than conjunction",
        query: `NOT x = "a" AND x IN /./`,
        word: "ab",
        expected_factors: [
            {x: "b"},
        ],
    },
    {
        name: "two free variables split the word",
        query: `$U = x y`,
        word: "ab",
        expected_factors: [
            {x: "", y: "ab"},
            {x: "a", y: "b"},
            {x: "ab", y: ""},
        ],
    },
    {
        name: "equal non-empty pairs",
        query: `x = y AND NOT x = ""`,
        word: "aba",
        expected_factors: [
            {x: "a", y: "a"},
            {x: "b", y: "b"},
            {x: "ab", y: "ab"},
            {x: "ba", y: "ba"},
            {x: "aba", y: "aba"},
        ],
    },
    {
        name: "squares with context",
        query: `$U = p x x s AND NOT x = ""`,
        word: "aabaab",
        expected_factors: [
            {p: "", x: "a", s: "baab"},
            {p: "", x: "aab", s: ""},
            {p: "aab", x: "a", s: "b"},
        ],
    },
    {
        name: "cube roots",
        query: `EXISTS p, s: $U = p x x x s AND NOT x = ""`,
        word: "abababa",
        expected_factors: [
            {x: "ab"},
            {x: "ba"},
        ],
    },
    {
        name: "factors occurring at least twice",
        query: `EXISTS p1, s1, p2, s2: $U = p1 x s1 AND $U = p2 x s2 AND NOT p1 = p2`,
        word: "abab",
        expected_factors: [
            {x: ""},
            {x: "a"},
            {x: "b"},
            {x: "ab"},
        ],
    },
    {
        name: "unicode syntax",
        query: `∃x: 𝔲 ≐ x x`,
        word: "abab",
        expected_boolean: true,
    },
    {
        name: "keyword universe variable",
        query: `EXISTS x: UNIV = x x`,
        word: "abab",
        expected_boolean: true,
    },
    {
        name: "unicode in-constraint",
        query: `x ∈̇ /b+/`,
        word: "abb",
        expected_factors: [
            {x: "b"},
            {x: "bb"},
        ],
    },
    {
        name: "emoji counts as one character (codepoints testing)",
        query: `x IN /./`,
        word: "a😀b",
        expected_factors: [
            {x: "a"},
            {x: "b"},
            {x: "😀"},
        ],
    },
    {
        name: "square of an emoji",
        query: `$U = x x`,
        word: "😀😀",
        expected_factors: [
            {x: "😀"},
        ],
    },
];
