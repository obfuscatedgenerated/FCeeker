grammar FC;

// TODO: will later support selecting the symbols at runtime (stretch goal)
// for now, will define a flexible syntax of unicode symbols, C style boolean ops, and english
NEGATION: '¬' | '!' | 'NOT';
CONJUNCTION: '∧' | '&&' | 'AND';
DISJUNCTION: '∨' | '||' | 'OR';

UNIVERSAL: '∀' | 'FORALL';
EXISTENTIAL: '∃' | 'EXISTS';
quantifier: UNIVERSAL | EXISTENTIAL;

UNIVERSE_VAR: '𝔲' | 'UNIV' | '$U'; // $U used by Adam Hutton, supported here for cross compatability

EQUALS: '≐' | '=';

LEFT_BRACKET: '(';
RIGHT_BRACKET: ')';
COMMA: ',';
COLON: ':';

// only supporting double quoted strings for now, it gets messy to handle the single quote escape
STRING: '"' STRING_BODY '"';
fragment STRING_BODY: (~('\n' | '\r' | '"' | '\\') | ESCAPED)*;
fragment ESCAPE: '\\';
fragment ESCAPED: (ESCAPE 'n') | (ESCAPE 'r') | (ESCAPE '"') | (ESCAPE ESCAPE);

VARNAME: LETTER VARCHAR*;
fragment LETTER: [\p{L}];
fragment DIGIT: [\p{Nd}];
fragment VARCHAR: LETTER | DIGIT | '_' | [\p{M}];

variable: VARNAME | UNIVERSE_VAR;
varlist: VARNAME (COMMA VARNAME)*;

pattern: (variable | STRING)+; // universe is actually allowed in the right hand side, but is rarely useful (TODO add a warning when impl runtime)

equality: variable EQUALS pattern;
atom: equality; // TODO: when regular constraints are added, they'll live here

formula:
      atom #Atomic |
      NEGATION formula #Negation |
      formula CONJUNCTION formula #Conjunction |
      formula DISJUNCTION formula #Disjunction |
      quantifier varlist COLON formula #Quantification |
      LEFT_BRACKET formula RIGHT_BRACKET #Subformula
      ;

start: formula EOF;

WS: [ \n\t\r]+ -> skip;

// TODO: if supporting multiple statements in one input, may be worth adding newline/semicolon here. if not, can leave as a simple .split
