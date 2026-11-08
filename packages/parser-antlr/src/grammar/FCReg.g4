grammar FCReg;

query: formula EOF;

formula:
      atom #Atomic
      | NEGATION formula #Negation
      | formula CONJUNCTION formula #Conjunction
      | formula DISJUNCTION formula #Disjunction
      | quantifier varList COLON formula #Quantification
      | LEFT_BRACKET formula RIGHT_BRACKET #Subformula
      ;

quantifier: UNIVERSAL | EXISTENTIAL;
varList: VARNAME (COMMA VARNAME)*;

atom: wordEquation | regularConstraint;
wordEquation: variable EQUALS pattern;
regularConstraint: variable IN_CONSTRAINT REGULAR_EXPRESSION;

pattern: (variable | STRING | EMPTY)+; // universe is actually allowed in the right hand side, but is rarely useful (TODO add a warning when impl runtime)

variable: VARNAME | UNIVERSE_VAR;

// TODO: will later support selecting the symbols at runtime (stretch goal)
// for now, will define a flexible syntax of unicode symbols, C style boolean ops, and english
NEGATION: '¬' | '!' | 'NOT';
CONJUNCTION: '∧' | '&&' | 'AND';
DISJUNCTION: '∨' | '||' | 'OR';

IN_CONSTRAINT: '∈' | '∈̇' | 'IN';

REGULAR_EXPRESSION: '/' REGULAR_EXPRESSION_BODY '/'; // note that regexp grammar not parsed here, will be handed to chosen engine at runtime to parse
fragment REGULAR_EXPRESSION_BODY: (~('/' | '\n' | '\r' | '\\') | REGULAR_EXPRESSION_ESCAPED)*;
fragment REGULAR_EXPRESSION_ESCAPED: ESCAPE ~('\n' | '\r'); // regexp will allow any escaped character, but not escaping an actual newline
// TODO: any flags worth exposing?

UNIVERSAL: '∀' | 'FORALL';
EXISTENTIAL: '∃' | 'EXISTS';

UNIVERSE_VAR: '𝔲' | 'UNIV' | 'INPUT' | '$U'; // $U used by Adam Hutton, supported here for cross compatability

EQUALS: '≐' | '=';

LEFT_BRACKET: '(';
RIGHT_BRACKET: ')';
COMMA: ',';
COLON: ':';

EMPTY: 'ε' | 'ϵ' | 'EMPTY'; // equivalent to "", but looks more proper

// only supporting double quoted strings for now, it gets messy to handle the single quote escape
STRING: '"' STRING_BODY '"';
fragment STRING_BODY: (~('\n' | '\r' | '"' | '\\') | ESCAPED)*;
fragment ESCAPE: '\\';
fragment ESCAPED: (ESCAPE 'n') | (ESCAPE 'r') | (ESCAPE '"') | (ESCAPE ESCAPE);

VARNAME: LETTER VARCHAR*;
fragment LETTER: [\p{L}];
fragment DIGIT: [\p{Nd}];
fragment VARCHAR: LETTER | DIGIT | '_' | [\p{M}];

WS: [ \n\t\r]+ -> skip;

// TODO: if supporting multiple statements in one input, may be worth adding newline/semicolon here. if not, can leave as a simple .split
