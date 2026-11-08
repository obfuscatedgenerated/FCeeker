import type {ExistentialQuantificationNode, UniversalQuantificationNode} from "@fceeker/ast";
import {type EvaluationContext, satisfies} from "./index";
import {generate_assignments_from_spans} from "../factors";

export const existential_quantifier_satisfies = (node: ExistentialQuantificationNode, ctx: EvaluationContext) => {
    const assignment_gen = generate_assignments_from_spans(node.variables.map(v => v.name), ctx.word, ctx.assignments);

    // for each assignment bound under the quantifier, return true on the first satisfying (it exists)
    for (const assignment of assignment_gen) {
        const satisfying = satisfies(node.formula, {
            ...ctx,
            assignments: assignment
        });

        if (satisfying) {
            return true;
        }
    }

    // none satisfying, none exist
    return false;
}

export const universal_quantifier_satisfies = (node: UniversalQuantificationNode, ctx: EvaluationContext) => {
    const assignment_gen = generate_assignments_from_spans(node.variables.map(v => v.name), ctx.word, ctx.assignments);

    // for each assignment bound under the quantifier, return false on the first contradiction
    for (const assignment of assignment_gen) {
        const satisfying = satisfies(node.formula, {
            ...ctx,
            assignments: assignment
        });

        if (!satisfying) {
            return false;
        }
    }

    // no contradictions, so universally satisfies
    return true;
}
