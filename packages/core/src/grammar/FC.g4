grammar FC;

DOUBLE_QUOTE: '"';
SINGLE_QUOTE: '\'';
LEFT_BRACKET: '(';
RIGHT_BRACKET: ')';
SEMICOLON: ';';

// TODO: will later support selecting the symbols at runtime (stretch goal)
// for now, will define a flexible syntax of unicode symbols, C style boolean ops, and english
NEGATION: '¬' | '!' | 'NOT';
CONJUNCTION: '∧' | '&&' | 'AND';
DISJUNCTION: '∨' | '||' | 'OR';
CONNECTIVE: NEGATION | CONJUNCTION | DISJUNCTION;

UNIVERSAL: '∀' | 'FORALL';
EXISTENTIAL: '∃' | 'EXISTS';
QUANTIFIER: UNIVERSAL | EXISTENTIAL;

EQUALS: '=';

ESCAPE: '\\';
ESCAPED_CHAR: ESCAPE (
        DOUBLE_QUOTE |
        SINGLE_QUOTE |
        LEFT_BRACKET |
        RIGHT_BRACKET |
        SEMICOLON |
        CONNECTIVE |
        QUANTIFIER |
        EQUALS
    );

WS: [ \n\t\r]+ -> skip;
VARNAME_CHAR: (~('"' | '\'' | '(' | ')' | ';') | ESCAPED_CHAR);
STRING_CHAR: .;

string: (SINGLE_QUOTE (STRING_CHAR*) SINGLE_QUOTE) | (DOUBLE_QUOTE (STRING_CHAR*) DOUBLE_QUOTE);
varname: VARNAME_CHAR+;

// this wont work yet, needs some revision
