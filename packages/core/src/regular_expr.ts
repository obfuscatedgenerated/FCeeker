import {RE2JS, RE2JSSyntaxException} from "re2js";

const cache = new Map<string, RE2JS>;

interface RegularExprCompileResultSuccess {
    success: true,
    reg_expr: RE2JS;
    cached: boolean;
}

interface RegularExprCompileResultSyntaxError {
    success: false,
    syntax_error: string;
}

export type RegularExprCompileResult = RegularExprCompileResultSuccess | RegularExprCompileResultSyntaxError;

export const compile_regular_expr = (pattern: string): RegularExprCompileResult => {
    if (cache.has(pattern)) {
        return {
            success: true,
            reg_expr: cache.get(pattern)!,
            cached: true
        };
    }

    try {
        const compiled = RE2JS.compile(pattern);

        return {
            success: true,
            reg_expr: compiled,
            cached: false
        };
    } catch (e) {
        if (e instanceof RE2JSSyntaxException) {
            return {
                success: false,
                syntax_error: e.error
            };
        }

        throw e;
    }
}
