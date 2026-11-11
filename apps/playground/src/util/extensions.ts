import {type Diagnostic, linter} from "@codemirror/lint";
import {parse_fc} from "./runner.ts";
import {
    Decoration,
    type DecorationSet,
    type EditorView,
    RangeSetBuilder,
    ViewPlugin,
    type ViewUpdate,
} from "@uiw/react-codemirror";
import {highlightingFor, HighlightStyle, syntaxHighlighting} from "@codemirror/language";

import type {TokenName} from "@fceeker/core";
import {lex} from "@fceeker/parser-antlr";
import {type Tag, tags} from "@lezer/highlight";

export const fc_linter = linter(view => {
    const parsed = parse_fc(view.state.doc.toString());
    if (!parsed.success) {
        return parsed.errors.map(e => ({
            from: e.span.start,
            to: e.span.end,
            severity: "error",
            message: `${e.kind}: ${e.message}`
        } satisfies Diagnostic));
    }

    return [];
});

const token_tags: Partial<Record<TokenName, Tag>> = {
    negation: tags.logicOperator,
    conjunction: tags.logicOperator,
    disjunction: tags.logicOperator,
    in_constraint: tags.operatorKeyword,
    equals: tags.compareOperator,
    universal: tags.propertyName,
    existential: tags.propertyName,
    universe_var: tags.special(tags.variableName),
    //varname: tags.literal,
    string: tags.string,
    empty: tags.special(tags.string),
    regular_expression: tags.regexp,
    left_bracket: tags.paren,
    right_bracket: tags.paren,
    comma: tags.separator,
    colon: tags.separator,
};

const build_decorations = (view: EditorView): DecorationSet => {
    const builder = new RangeSetBuilder<Decoration>();
    const {tokens} = lex(view.state.doc.toString());
    const marks = new Map<Tag, Decoration | null>();

    for (const token of tokens) {
        const tag = token_tags[token.name];
        if (!tag) {
            continue;
        }

        if (!marks.has(tag)) {
            const theme_class = highlightingFor(view.state, [tag]);
            marks.set(tag, theme_class ? Decoration.mark({class: theme_class}) : null);
        }

        const mark = marks.get(tag);
        if (mark) {
            builder.add(token.span.start, token.span.end, mark);
        }
    }

    return builder.finish();
};

export const fc_syntax_highlighter = ViewPlugin.fromClass(class {
    decorations: DecorationSet;

    constructor(view: EditorView) {
        this.decorations = build_decorations(view);
    }

    update(update: ViewUpdate) {
        // only lex when the text changes, or the theme changes (which may need class names to be updated)
        if (update.docChanged || update.transactions.some(tr => tr.reconfigured)) {
            this.decorations = build_decorations(update.view);
        }
    }
}, {
    decorations: (plugin) => plugin.decorations
});

export const fc_special_highlights = syntaxHighlighting(
    HighlightStyle.define([
        { tag: tags.special(tags.variableName), fontWeight: "bold" },
        { tag: tags.special(tags.string), fontWeight: "bold" }
    ])
);
